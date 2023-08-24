import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { StripeModule } from 'src/stripe/stripe.module';
import { OrganisationContractor } from 'src/trans-atlantic/organisation-contractor/organisation-contractor.entity';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { EmailTemplateTriggerModule } from '../email-template/email-template-trigger/email-template-trigger.module';
import { Organisation } from '../organisation/organisation.entity';
import { OrganisationModule } from '../organisation/organisation.module';
import { Role } from '../role/role.entity';
import { RoleModule } from '../role/role.module';
import { Siteuser } from '../site-user/site-user.entity';
import { Userdirectaccess } from '../user-direct-access/user-direct-access.entity';
import { SelfSignUpController } from './self-sign-up.controller';
import {
  TransAtUserController,
  UserController,
  UserTest,
} from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  controllers: [
    UserController,
    SelfSignUpController,
    UserTest,
    TransAtUserController,
  ],
  providers: [UserService],
  exports: [UserService],
  imports: [
    TypeOrmModule.forFeature([
      User,
      Organisation,
      Userdirectaccess,
      Siteuser,
      Role,
      OrganisationContractor,
    ]),
    PermissionsModule,
    EmailTemplateTriggerModule,
    AuthenticationModule,
    forwardRef(() => StripeModule),
    RoleModule,
    forwardRef(() => OrganisationModule),
  ],
})
export class UserModule {}
