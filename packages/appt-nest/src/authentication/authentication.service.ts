import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiProperty } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { EmailTemplateTriggerService } from 'src/auto-resources/email-template/email-template-trigger/email-template-trigger.service';
import { EmailTrigger } from 'src/auto-resources/email-template/email-template-trigger/email-template-triggers';
import { Organisation } from 'src/auto-resources/organisation/organisation.entity';
import { RecordService } from 'src/auto-resources/record/record.service';
import { Siteadmin } from 'src/auto-resources/site-admin/site-admin.entity';
import { Siteuser } from 'src/auto-resources/site-user/site-user.entity';
import { Site } from 'src/auto-resources/site/site.entity';
import { User } from 'src/auto-resources/user/user.entity';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { LocalsService } from '../services/locals/locals.service';
import { LoginDTO } from './types/login.dto';
import { PasswordResetRequestDTO } from './types/password-reset-request.dto';
import { PasswordResetDTO } from './types/password-reset.dto';
import {
  APIToken,
  RefreshAPIToken,
  RefreshPayload,
  TokenPayload,
} from './types/token-payload';

export const refreshTokenCookieName = `transat_refreshToken`;

export class LoginReturn {
  @ApiProperty({
    description: 'A JWT.',
  })
  token: string;

  @ApiProperty({
    description: 'The user object',
  })
  user: User;

  @ApiProperty({
    description: 'An array of Organisations the user is part of.',
    type: [Organisation],
  })
  userOrganisations: Organisation[];

  @ApiProperty({
    description: 'An array of Sites the user owns.',
    type: [Site],
  })
  userOwnedSites: Site[];
  @ApiProperty({
    description: 'An array of Sites the user is an admin for.',
    type: [Site],
  })
  sitesAsAdmin: Site[];
  @ApiProperty({
    description: 'An array of Sites the user is a part of.',
    type: [Site],
  })
  sitesAsUser: Site[];
}

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);
  private saltRounds = 10;
  private passwordAttemptsAllowed = 5;
  private passwordLockExpireTime = '15 minutes';

  constructor(
    @InjectRepository(User)
    public userRepo: Repository<User>,
    @InjectRepository(Organisation)
    public orgRepo: Repository<Organisation>,
    @InjectRepository(Site)
    public siteRepo: Repository<Site>,
    @InjectRepository(Siteuser)
    public siteUserRepo: Repository<Siteuser>,
    @InjectRepository(Siteadmin)
    public siteAdminRepo: Repository<Siteadmin>,
    private readonly locals: LocalsService,
    private emailTriggerService: EmailTemplateTriggerService,
    private recordService: RecordService,
  ) {}

  public async login(data: LoginDTO, res: Response): Promise<LoginReturn> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .where('LOWER(user.username) = LOWER(:username)', {
        username: data.username.toLocaleLowerCase(),
      })
      .leftJoinAndSelect('user.organisations', 'org')
      .leftJoinAndSelect('org.logo', 'logo')
      .getOne();

    if (!user || !user.password || user.passwordLocked)
      throw new UnauthorizedException();
    if (!(await this.verifyPassword(data.password, user.password))) {
      if (++user.passwordAttempts >= this.passwordAttemptsAllowed) {
        user.passwordLocked = new Date();
      }
      await this.userRepo.save(user);
      throw new UnauthorizedException();
    }

    const token = this.generateTokenWithPayload({ userId: user.id });

    // Attaches the fresh token to the response
    this.cookieRefreshToken(res, user.id);

    // Update last logged in
    user.lastLoggedIn = new Date();
    user.passwordAttempts = 0;
    await this.userRepo.save(user);

    for (const org of user.organisations) {
      if (org.logo) {
        try {
          org.logo = await this.recordService.signURL(org.logo);
        } catch (err) {}
      }
    }

    return {
      token,
      user,
      userOrganisations: user.organisations,
      userOwnedSites: await this.siteRepo.find({
        where: { ownerModel: user },
        relations: ['organisationModel'],
      }),
      sitesAsAdmin: (
        await this.siteAdminRepo.find({
          where: { ownerModel: user },
          select: ['siteModel'],
          relations: ['siteModel', 'siteModel.organisationModel'],
        })
      ).map((x) => x.siteModel) as Site[],
      sitesAsUser: (
        await this.siteUserRepo.find({
          where: { ownerModel: user },
          select: ['siteModel'],
          relations: ['siteModel', 'siteModel.organisationModel'],
        })
      ).map((x) => x.siteModel) as Site[],
    };
  }

  public validateToken(token: APIToken): TokenPayload | RefreshPayload | null {
    try {
      return verify(token, process.env.JWT_SECRET) as TokenPayload;
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }

  public getRefreshToken(userId: string) {
    return sign(
      {
        userId: userId,
        refreshToken: true,
      },
      process.env.JWT_SECRET,
      { expiresIn: 30 * 60 },
    ); // 30 min expire
  }

  public clearAuthCookie(res: Response) {
    // 5 mins = Date.now() + (5 * 60 * 1000)
    const maxAge = 2147483647;
    if (process.env.IS_PRODUCTION) {
      res.clearCookie(refreshTokenCookieName, {
        domain: 'prod-api-transatlantic.ontheappt.cloud',
        maxAge: maxAge,
        secure: true,
        sameSite: 'strict',
        httpOnly: true,
      });
    } else {
      res.clearCookie(refreshTokenCookieName, {
        domain: 'ontheappt.cloud',
        maxAge: maxAge,
        secure: true,
        sameSite: 'strict',
        httpOnly: true,
      });
    }
  }

  public cookieRefreshToken(res: Response, userId: string = null) {
    // 5 mins = Date.now() + (5 * 60 * 1000)
    const maxAge = 2147483647;
    const token = this.getRefreshToken(
      userId ? userId : this.locals.getUserId(res),
    );
    if (process.env.IS_PRODUCTION) {
      res.cookie(refreshTokenCookieName, token, {
        domain: 'prod-api-transatlantic.ontheappt.cloud',
        maxAge: maxAge,
        secure: true,
        sameSite: 'strict',
        httpOnly: true,
      });
    } else {
      res.cookie(refreshTokenCookieName, token, {
        domain: null,
        maxAge: maxAge,
        sameSite: 'none',
        secure: true,
        httpOnly: true,
      });
      res.cookie(refreshTokenCookieName, token, {
        domain: 'ontheappt.cloud',
        maxAge: maxAge,
        secure: true,
        sameSite: 'strict',
        httpOnly: true,
      });
    }
  }

  public validateRefreshToken(token: RefreshAPIToken): RefreshPayload | false {
    try {
      return verify(token, process.env.JWT_SECRET) as RefreshPayload;
    } catch (err) {
      return false;
    }
  }

  private generatePayload(userId: string): TokenPayload {
    return {
      userId: userId,
    };
  }

  public generateToken(userId: string): APIToken {
    return sign(this.generatePayload(userId), process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXP,
    });
  }

  public generateTokenWithPayload(payload: TokenPayload) {
    return sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXP,
    });
  }

  generatePassword(password: string): Promise<string> {
    return new Promise((res, rej) => {
      bcrypt.hash(password, this.saltRounds, function (err, hash) {
        if (err) return rej(err);
        return res(hash);
      });
    });
  }

  verifyPassword(password: string, encryptedPassword: string) {
    return bcrypt.compare(password, encryptedPassword);
  }

  async passwordReset(data: PasswordResetDTO) {
    const user = await this.userRepo.findOne({
      passwordResetToken: data.token,
    });

    if (!user) throw new ForbiddenException('Password reset token not valid');

    const password = await this.generatePassword(data.password);

    await this.userRepo.update(user.id, {
      password: password,
      passwordResetToken: null,
    });

    return {};
  }

  async passwordResetRequest(data: PasswordResetRequestDTO) {
    const user = await this.userRepo.findOne({
      email: data.email,
      deleted: false,
    });

    if (!user)
      throw new BadRequestException('No user matching that email address');

    const uuid = v4();
    await this.userRepo.update(user.id, {
      passwordResetToken: uuid,
    });

    try {
      await this.sendPasswordResetEmail(user, uuid);
    } catch (err) {
      console.log(err);
    }

    return { token: uuid };
  }

  async sendPasswordResetEmail(user: User, uuid: string) {
    const organisation = await this.orgRepo.findOne(
      process.env.DEFAULT_ORG_UUID,
    );
    await this.emailTriggerService.triggerOrganisationEmail(
      organisation,
      [EmailTrigger.password_reset],
      {
        ...User.getEmailTriggerContext(user),
        ...{
          password_reset_url:
            process.env.SERVER_ADDRESS + '/reset-password?token=' + uuid,
        },
      },
    );
  }

  @Cron(CronExpression.EVERY_MINUTE, {
    name: 'Unlock Locked Accounts',
  })
  async expireLockedAccounts() {
    await this.userRepo
      .createQueryBuilder()
      .update()
      .set({
        passwordLocked: null,
        passwordAttempts: this.passwordAttemptsAllowed - 1,
      })
      .where(
        `passwordLocked IS NOT NULL AND passwordLocked < (NOW() - :resetTime::interval)`,
        { resetTime: this.passwordLockExpireTime },
      )
      .execute();
  }
}
