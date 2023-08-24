import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  HttpStatus,
  Param,
  Post,
  Res,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateManyDto,
  Crud,
  CrudController,
  CrudRequestInterceptor,
  Override,
  ParsedBody,
} from '@nestjsx/crud';
import { Response } from 'express';
import { LocalsService } from 'src/services/locals/locals.service';
import { AuthenticationService } from '../../authentication/authentication.service';
import { HasOrganisationGuard } from '../../guards/has-organisation.guard';
import { HasSiteGuard } from '../../guards/has-site.guard';
import { IsLoggedInGuard } from '../../guards/is-logged-in.guard';
import { UserHasPermissionGuard } from '../../guards/user-has-permission.guard';
import { OrganisationService } from '../organisation/organisation.service';
import { SelfSignUpDTO } from './entities/appt-self-sign-up.dto';
import { TestUserDTO, TestUserDTO2 } from './entities/test-user.dto';
import { UserAutoInterceptor } from './user-auto.interceptor';
import {
  TransAtRoleTitles,
  TransAtSignupBody,
  TransAtUserPermissions,
  User,
  UserDTO,
  UserUpdateDTO,
} from './user.entity';
import { UserService } from './user.service';

@Crud({
  model: {
    type: User,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  dto: {
    create: UserDTO,
    update: UserUpdateDTO,
    replace: UserUpdateDTO,
  },
  routes: {
    exclude: ['deleteOneBase'],
    getManyBase: {
      decorators: [
        UseGuards(UserHasPermissionGuard),
        SetMetadata('permissions', [`UserGetMany`]),
      ],
    },
    getOneBase: {
      decorators: [
        UseGuards(UserHasPermissionGuard),
        SetMetadata('permissions', [`UserGetOne`]),
      ],
    },
    createOneBase: {
      decorators: [
        UseGuards(UserHasPermissionGuard),
        SetMetadata('permissions', [`UserCreateOne`]),
      ],
    },
    createManyBase: {
      decorators: [
        UseGuards(UserHasPermissionGuard),
        SetMetadata('permissions', [`UserCreateMany`]),
      ],
    },
    updateOneBase: {
      decorators: [
        UseGuards(UserHasPermissionGuard),
        SetMetadata('permissions', [`UserUpdateOne`]),
      ],
    },
    replaceOneBase: {
      decorators: [
        UseGuards(UserHasPermissionGuard),
        SetMetadata('permissions', [`UserReplaceOne`]),
      ],
    },
    deleteOneBase: {
      decorators: [
        UseGuards(UserHasPermissionGuard),
        SetMetadata('permissions', [`UserDeleteOne`]),
      ],
    },
  },
  query: {
    join: {
      contractors: {
        eager: true,
      },
    },
  },
})
@ApiTags('user')
@Controller('user')
@UseInterceptors(UserAutoInterceptor, CrudRequestInterceptor)
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class UserController implements CrudController<User> {
  constructor(public service: UserService) {}

  @Post('invite')
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [`CreateUser`])
  invite(@Res({ passthrough: true }) res: Response, @Body() data: UserDTO) {
    return this.service.invite(res, data);
  }

  @Override('createOneBase')
  async createOne(
    @ParsedBody() dto: UserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      return await this.service.createUserWithOrgSite(res, dto);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Override('createManyBase')
  async createMany(
    @ParsedBody() dtos: CreateManyDto<UserDTO>,
    @Res({ passthrough: true }) res: Response,
  ) {
    const ret = [];
    for (const dto of dtos.bulk) {
      try {
        ret.push(await this.service.createUserWithOrgSite(res, dto));
      } catch (err) {
        throw new BadRequestException(err);
      }
    }
    return ret;
  }

  @Post('/ssu/start')
  startSingleSignOn(@Body() userDTO: SelfSignUpDTO) {
    return this.service.startSelfSignOn(userDTO);
  }
}

@ApiTags('user')
@Controller('user')
export class TransAtUserController {
  constructor(public service: UserService, public locals: LocalsService) {}

  @Delete(':id')
  async deleteOne(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ) {
    await this.service.transAtDelete(
      res,
      await this.service.userRepo.findOne(id),
    );
    res.status(HttpStatus.OK);
    return {};
  }

  @Post('/transatlantic/usersignup')
  signup(@Body() transAtSignUp: TransAtSignupBody) {
    return this.service.transAtSignOn(transAtSignUp);
  }

  @Post('/transatlantic/adminuser')
  @SetMetadata('permissions', [TransAtUserPermissions.CREATE_ADMIN_USER])
  @UseGuards(
    UserHasPermissionGuard,
    IsLoggedInGuard,
    HasOrganisationGuard,
    HasSiteGuard,
  )
  newAdmin(@Res({ passthrough: true }) res: Response, @Body() body: UserDTO) {
    return this.service.transAtInvite(
      body,
      TransAtRoleTitles.ADMIN_ROLE,
      this.locals.getOrganisation(res),
    );
  }

  @Post('/transatlantic/hseUser')
  @SetMetadata('permissions', [TransAtUserPermissions.CREATE_ADMIN_USER])
  @UseGuards(
    UserHasPermissionGuard,
    IsLoggedInGuard,
    HasOrganisationGuard,
    HasSiteGuard,
  )
  newHSEUser(@Res({ passthrough: true }) res: Response, @Body() body: UserDTO) {
    return this.service.transAtInvite(
      body,
      TransAtRoleTitles.HSE_ROLE,
      this.locals.getOrganisation(res),
    );
  }

  @Post('/transatlantic/kpiuser')
  @SetMetadata('permissions', [TransAtUserPermissions.CREATE_KPI_USER])
  @UseGuards(
    UserHasPermissionGuard,
    IsLoggedInGuard,
    HasOrganisationGuard,
    HasSiteGuard,
  )
  newKPI(@Res({ passthrough: true }) res: Response, @Body() body: UserDTO) {
    return this.service.transAtInvite(
      body,
      TransAtRoleTitles.KPI_ROLE,
      this.locals.getOrganisation(res),
    );
  }

  @Post('/transatlantic/appuser')
  @SetMetadata('permissions', [TransAtUserPermissions.CREATE_APP_USER])
  @UseGuards(
    UserHasPermissionGuard,
    IsLoggedInGuard,
    HasOrganisationGuard,
    HasSiteGuard,
  )
  newAppUser(@Res({ passthrough: true }) res: Response, @Body() body: UserDTO) {
    return this.service.transAtInvite(
      body,
      TransAtRoleTitles.APP_ROLE,
      this.locals.getOrganisation(res),
    );
  }
}

@ApiTags('d11cb2ca-929d-444b-936b-2ede5630da8e')
@Controller('d11cb2ca-929d-444b-936b-2ede5630da8e')
export class UserTest {
  constructor(
    public service: UserService,
    public orgservice: OrganisationService,
    private authService: AuthenticationService,
  ) {}

  @Post('kpiuser')
  @ApiOperation({
    summary: `
  This will create a user with the KPI role and also assign them a new organisation.
  If the user already exists the users type will be changed.
  The users password will default to '100%Safe'
  `,
  })
  async createTestUserkpi(
    @Res({ passthrough: true }) res: Response,
    @Body() body: TestUserDTO2,
  ) {
    // this should never reach production
    if (process.env.IS_PRODUCTION) return;
    let user = await this.service.userRepo.findOne(
      { email: body.email },
      { relations: ['organisations'] },
    );

    if (user) {
      user.type = TransAtRoleTitles.KPI_ROLE;
      await this.service.userRepo.save(user);
    } else {
      user = await this.service.userRepo.save(
        this.service.userRepo.create({
          email: body.email,
          username: body.email,
          password: await this.authService.generatePassword('100%Safe'),
          emailverified: true,
          type: TransAtRoleTitles.KPI_ROLE,
        }),
      );
    }

    // Create the organisation
    const newOrg = await this.authService.orgRepo.save({});

    // Add user to org
    if (!user.organisations) user.organisations = [];
    user.organisations.push(newOrg);
    await this.authService.userRepo.save(user);

    // create tjhe roles
    await this.orgservice.createTransAtRoles(newOrg, user);

    // assign the role
    const role = await this.orgservice.roleService.repo.findOne({
      title: TransAtRoleTitles.KPI_ROLE,
      organisation: newOrg.id,
    });
    await this.orgservice.roleService.assignUserRole(user.id, role);

    return user;
  }

  @Post('6f4a060e-0775-417f-83d5-648e0c51b093')
  async createTestUser(
    @Res({ passthrough: true }) res: Response,
    @Body() body: TestUserDTO,
  ) {
    if (!process.env.IS_PRODUCTION) {
      let user = await this.service.userRepo.findOne(
        { email: body.email },
        { relations: ['organisations'] },
      );
      if (!user) {
        user = await this.service.userRepo.save(
          this.service.userRepo.create({
            email: body.email,
            username: body.email,
            password: await this.authService.generatePassword(body.password),
            emailverified: true,
            isglobaladmin: true,
            isdeveloper: true,
          }),
        );
        user.organisations = [];
      } else {
        user.password = await this.authService.generatePassword(body.password);
      }

      if (body.organisation) {
        const org = await this.authService.orgRepo.findOne(body.organisation);
        user.organisations.push(org);
        await this.authService.userRepo.save(user);
      } else {
        const newOrg = await this.authService.orgRepo.save({});
        user.organisations.push(newOrg);
        await this.authService.userRepo.save(user);
      }

      return this.authService.login(
        {
          username: body.email,
          password: body.password,
        },
        res,
      );
    } else {
      console.error(
        `ALERT: 6f4a060e-0775-417f-83d5-648e0c51b093 - has been called `,
      );
      throw new ForbiddenException();
    }
  }
}
