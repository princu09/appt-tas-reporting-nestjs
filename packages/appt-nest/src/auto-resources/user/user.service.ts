import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Response } from 'express';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { StripeService } from 'src/stripe/stripe.service';
import { OrganisationContractor } from 'src/trans-atlantic/organisation-contractor/organisation-contractor.entity';
import Stripe from 'stripe';
import { DeepPartial, getConnection, Repository } from 'typeorm';
import { v4 } from 'uuid';
import { LocalsService } from '../../services/locals/locals.service';
import { EmailTemplateTriggerService } from '../email-template/email-template-trigger/email-template-trigger.service';
import { EmailTrigger } from '../email-template/email-template-trigger/email-template-triggers';
import { Organisation } from '../organisation/organisation.entity';
import { OrganisationService } from '../organisation/organisation.service';
import { Role } from '../role/role.entity';
import { RoleService } from '../role/role.service';
import { Siteuser } from '../site-user/site-user.entity';
import { SelfSignUpDTO } from './entities/appt-self-sign-up.dto';
import {
  TransAtRoleTitles,
  TransAtSignupBody,
  User,
  UserDTO,
} from './user.entity';

@Injectable()
export class UserService extends TypeOrmCrudService<User> {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    public userRepo: Repository<User>,
    @InjectRepository(Organisation)
    public org: Repository<Organisation>,
    @InjectRepository(Siteuser)
    public siteUserRepo: Repository<Siteuser>,
    @InjectRepository(OrganisationContractor)
    public orgContractorRepo: Repository<OrganisationContractor>,
    @InjectRepository(Role)
    public roleRepo: Repository<Role>,
    public roleUserService: RoleService,
    public locals: LocalsService,
    public emailTriggerService: EmailTemplateTriggerService,
    private authService: AuthenticationService,
    @Inject(forwardRef(() => StripeService))
    private stripeService: StripeService,
    @Inject(forwardRef(() => OrganisationService))
    private organisationService: OrganisationService,
  ) {
    super(userRepo);
  }

  async transAtDelete(res: Response, toDelete: User) {
    const deleter = this.locals.getUser(res);

    // Admin user deleting anyone
    if (deleter.type == TransAtRoleTitles.ADMIN_ROLE) {
      await this.userRepo.softDelete(toDelete.id);
      return;
    }

    // App user deleting themselves
    if (
      deleter.type === TransAtRoleTitles.APP_ROLE &&
      toDelete.id === this.locals.getUserId(res)
    ) {
      await this.userRepo.softDelete(toDelete.id);
      return;
    }

    // KPI user deleting an app user
    if (
      deleter.type == TransAtRoleTitles.KPI_ROLE &&
      toDelete?.type == TransAtRoleTitles.APP_ROLE
    ) {
      await this.userRepo.softDelete(toDelete.id);
      return;
    }

    throw new ForbiddenException();
  }

  async createUserWithOrgSite(res: Response, user: DeepPartial<User>) {
    const newUser = await this.userRepo.save(user);

    // Set Org
    await this.org
      .createQueryBuilder('org')
      .relation(Organisation, 'users')
      .of(this.locals.getOrganisation(res))
      .add(newUser);

    // Get Role
    const defaultRole = await this.roleRepo.find({
      defaultrole: true,
      organisation: this.locals.getOrganisation(res).id,
    });

    // Assign default role
    if (defaultRole && defaultRole?.length) {
      await this.roleUserService.assignUserRole(newUser.id, defaultRole[0]);
    }

    // Create site relation if needed
    if (this.locals.getOrganisation(res).hassites) {
      await this.siteUserRepo.save({
        site: this.locals.getSite(res).id,
        owner: newUser.id,
        organisation: this.locals.getOrganisation(res).id,
      });
    }

    return newUser;
  }

  async invite(res: Response, newUser: UserDTO) {
    const token = v4();
    const user = await this.createUserWithOrgSite(res, {
      ...newUser,
      ...{ passwordResetToken: token },
    });
    await this.emailTriggerService.triggerOrganisationEmail(
      this.locals.getOrganisation(res),
      [EmailTrigger.new_user_invite],
      {
        ...User.getEmailTriggerContext(user),
        ...{
          password_reset_url:
            process.env.SERVER_ADDRESS + '/reset-password?token=' + token,
        },
      },
    );
  }

  async transAtInvite(
    body: UserDTO,
    userType: TransAtRoleTitles,
    org: Organisation,
  ) {
    const token = v4();
    const user = await this.transAtUserCreate(body, userType, org, token);
    await this.emailTriggerService.triggerOrganisationEmail(
      org,
      [EmailTrigger.new_user_invite],
      {
        ...User.getEmailTriggerContext(user),
        ...{
          password_reset_url:
            process.env.SERVER_ADDRESS + '/reset-password?token=' + token,
        },
      },
    );
    return user;
  }

  async transAtSignOn(body: TransAtSignupBody) {
    const count = await this.userRepo.count({ username: body.username });
    if (count) return;

    await this.userRepo.save({
      username: body.username,
      password: await this.authService.generatePassword(body.password),
      email: body.username,
      type: TransAtRoleTitles.APP_ROLE,
    });
  }

  async transAtUserCreate(
    body: UserDTO,
    userType: TransAtRoleTitles,
    org: Organisation,
    token: string,
  ) {
    body.email = body.email.toLocaleLowerCase();
    body.username = body.username.toLocaleLowerCase();
    // find user - create user
    let user = await this.repo.findOne({
      where: {
        email: body.email,
        username: body.username,
      },
      withDeleted: true,
    });

    // Always set the password token
    if (!user) {
      body.type = userType;
      user = await this.repo.save({
        ...body,
        isglobaladmin: userType === TransAtRoleTitles.ADMIN_ROLE,
        passwordResetToken: token,
      });
    } else {
      user.passwordResetToken = token;
      user.deleted = false;
      user.deletedAt = null;
      await this.repo.save(user);
    }

    // Assign them the default contractor
    if (userType === TransAtRoleTitles.APP_ROLE) {
      const defaultContractor = await this.orgContractorRepo.find({
        where: { organisationModel: org, default: true },
        relations: ['users'],
      });
      if (defaultContractor.length) {
        defaultContractor[0].users.push(user);
        await this.orgContractorRepo.save(defaultContractor[0]);
      }
    }

    // add them to org
    this.organisationService.addUserToOrg(user.id, org);

    // assign the role
    const role = await this.roleRepo.findOne({
      title: userType,
      organisation: org.id,
    });

    if (!role) {
      this.logger.error(
        `ERROR: This organisation has no role for ${userType},${org.id}`,
      );
      return;
    }

    await this.roleUserService.assignUserRole(user.id, role);
    return user;
  }

  async startSelfSignOn(newUser: SelfSignUpDTO) {
    // Check if user already exists
    if (
      await this.repo.count({
        where: [
          { email: newUser.email.toLocaleLowerCase() },
          { username: newUser.username.toLocaleLowerCase() },
        ],
      })
    )
      throw new BadRequestException(`Username or Email already in use.`);

    // Create user
    const password = await this.authService.generatePassword(newUser.password);
    const user = await this.repo.save({
      password: password,
      username: newUser.username.toLocaleLowerCase(),
      email: newUser.email.toLocaleLowerCase(),
    });

    // Create connected account
    const accountReturn = await this.stripeService.createConnectedAccount(user);

    if (!accountReturn) {
      this.logger.error(
        `startSelfSignOn:: Failed to create connected account for ${user.id}`,
      );
      throw new InternalServerErrorException(
        `Failed to create connected account`,
      );
    }

    // Create and return the intent
    const intent = await this.stripeService.startPayment(
      100,
      user,
      {
        selfSignUp: user.id,
      },
      StripeService.PaymentType.APPT_SELF_SIGN_UP,
    );

    // Return the client secret
    return { secret: intent.client_secret };
  }

  async processSelfSignOnIntent(intent: Stripe.PaymentIntent) {
    // Check we have the data we need
    const userId = intent.metadata['selfSignUp'];
    if (!userId) {
      this.logger.error(
        `processSelfSignOnIntent:: Missing user id for intent ${intent.id}`,
      );
      return;
    }

    // Check the user exists
    const user = await this.repo.findOne(userId);

    // Already done
    if (user.selfSignUpProcessed) return;
    user.selfSignUpProcessed = true;

    if (!user) {
      this.logger.error(
        `processSelfSignOnIntent:: Missing user for user id ${userId} for intent ${intent.id}`,
      );
      return;
    }

    // Create organisation
    const org = this.org.create({
      name: `Self Sign Up Organisation ${user.id}`,
      adminModel: user,
    });

    // Create the admin role and assign the sso user
    const adminRole = this.roleRepo.create({
      title: 'Admin',
      permissions: [],
      defaultrole: false,
    });
    await this.roleUserService.assignUserRole(user.id, adminRole);

    // Create the default user
    const standardRole = this.roleRepo.create({
      title: 'Standard',
      permissions: [],
      defaultrole: true,
    });

    // Create transaction and save the new objects
    try {
      await getConnection().transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager.save(org);
        await transactionalEntityManager.save(adminRole);
        await transactionalEntityManager.save(standardRole);
        await transactionalEntityManager.save(user);
      });
    } catch (err) {
      this.logger.error(
        `processSelfSignOnIntent:: Transacation failed ${JSON.stringify(err)}`,
      );
    }
  }
}
