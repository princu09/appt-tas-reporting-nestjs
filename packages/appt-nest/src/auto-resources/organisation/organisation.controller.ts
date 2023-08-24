import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  CrudRequestInterceptor,
  ParsedRequest,
} from '@nestjsx/crud';
import { Response } from 'express';
import { IsGlobalAdminGuard } from 'src/guards/is-global-admin.guard';
import { RecordInterceptor } from 'src/interceptors/record.interceptor';
import { LocalsService } from 'src/services/locals/locals.service';
import { In, getConnection } from 'typeorm';
import { HasOrganisationGuard } from '../../guards/has-organisation.guard';
import { HasSiteGuard } from '../../guards/has-site.guard';
import { IsLoggedInGuard } from '../../guards/is-logged-in.guard';
import { UserHasPermissionGuard } from '../../guards/user-has-permission.guard';
import { OrganisationAutoInterceptor } from './organisation-auto.interceptor';
import {
  Organisation,
  OrganisationDTO,
  TransAtOrgDTO,
  TransAtOrgUpdateDTO,
} from './organisation.entity';
import { OrganisationService } from './organisation.service';

@Crud({
  model: {
    type: Organisation,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  dto: {
    update: OrganisationDTO,
    create: OrganisationDTO,
    replace: OrganisationDTO,
  },
  routes: {
    getManyBase: {
      decorators: [
        UseGuards(UserHasPermissionGuard),
        SetMetadata('permissions', [`OrganisationGetMany`]),
      ],
    },
    getOneBase: {
      decorators: [
        UseGuards(UserHasPermissionGuard),
        SetMetadata('permissions', [`OrganisationGetOne`]),
      ],
    },
    createOneBase: {
      decorators: [
        UseGuards(UserHasPermissionGuard),
        SetMetadata('permissions', [`OrganisationCreateOne`, `CreateOrg`]),
      ],
    },
    createManyBase: {
      decorators: [
        UseGuards(UserHasPermissionGuard),
        SetMetadata('permissions', [`OrganisationCreateMany`, `CreateOrg`]),
      ],
    },
    updateOneBase: {
      decorators: [
        UseGuards(UserHasPermissionGuard),
        SetMetadata('permissions', [`OrganisationUpdateOne`]),
      ],
    },
    replaceOneBase: {
      decorators: [
        UseGuards(UserHasPermissionGuard),
        SetMetadata('permissions', [`OrganisationReplaceOne`]),
      ],
    },
    deleteOneBase: {
      decorators: [
        UseGuards(UserHasPermissionGuard),
        SetMetadata('permissions', [`OrganisationDeleteOne`]),
      ],
    },
  },
  query: {
    join: {
      contractors: {},
      logo: {
        eager: true,
      },
    },
  },
})
@ApiTags('organisation')
@Controller('organisation')
@UseInterceptors(
  OrganisationAutoInterceptor,
  CrudRequestInterceptor,
  RecordInterceptor,
)
@SetMetadata('records', [`logo`])
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class OrganisationController implements CrudController<Organisation> {
  constructor(
    public service: OrganisationService,
    public locals: LocalsService,
  ) {}

  @Get(':id/users')
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [`OrganisationGetUsers`])
  async getUsers(
    @Res({ passthrough: true }) res: Response,
    @ParsedRequest() req: CrudRequest,
  ) {
    const data = await this.service.getOne(req);
    if (data?.id) {
      data.users = (
        await this.service.repo.findOne(data.id, { relations: ['users'] })
      ).users;
    }
    return data;
  }

  @Post('/uploadlogo')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload a new logo for the organisation' })
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [`OrganisationUpdateOne`])
  uploadLogo(
    @Res({ passthrough: true }) res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.newLogo(res, file);
  }

  @Post('transatlantic')
  @UseGuards(IsGlobalAdminGuard)
  transAtNewOrg(
    @Res({ passthrough: true }) res: Response,
    @Body() body: TransAtOrgDTO,
  ) {
    return this.service.createTransAtOrg(res, body);
  }

  @Patch('transatlantic')
  @UseGuards(IsGlobalAdminGuard)
  transAtUpdateOrg(
    @Res({ passthrough: true }) res: Response,
    @Body() body: TransAtOrgUpdateDTO,
  ) {
    return this.service.updateTransAtOrg(res, body);
  }

  @Post('user/:id')
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [`OrganisationUpdateOne`])
  addUserToOrg(
    @Res({ passthrough: true }) res: Response,
    @Param('id') userId: string,
  ) {
    return this.service.addUserToOrg(userId, this.locals.getOrganisation(res));
  }

  @Delete('user/:id')
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [`OrganisationUpdateOne`])
  removeUserFromOrg(
    @Res({ passthrough: true }) res: Response,
    @Param('id') userId: string,
  ) {
    return this.service.removeUserFromOrg(
      userId,
      this.locals.getOrganisation(res),
    );
  }
}

@ApiTags('organisation')
@Controller('organisation')
@UseInterceptors(RecordInterceptor)
@SetMetadata('records', [`logo`])
@UseGuards(IsLoggedInGuard)
export class OrganisationTransatlanticController
  implements CrudController<Organisation>
{
  constructor(
    public service: OrganisationService,
    public locals: LocalsService,
  ) {}

  @Get('/appuser/organisations')
  @ApiOperation({
    summary: `Use this for app users to check if they have any organisations or not`,
  })
  async get(@Res({ passthrough: true }) res: Response) {
    // Get orgs
    const ret = await getConnection().query(
      `SELECT "organisationId" FROM organisation_users_user where "userId" = $1`,
      [this.locals.getUserId(res)],
    );

    // Get ids
    const ids = ret.map((x) => x.organisationId);

    // Return them
    return this.service.repo.find({ where: { id: In(ids) } });
  }

  @Get('/transat/reset/perms')
  @UseGuards(IsGlobalAdminGuard)
  async perm() {
    await this.service.updateAllTransAtRolePerms();
  }
}

@ApiTags('organisation')
@Controller('organisation')
@UseInterceptors(RecordInterceptor)
@SetMetadata('records', [`logo`])
@UseGuards(IsLoggedInGuard, HasOrganisationGuard)
export class OrganisationTransatlanticClientController
  implements CrudController<Organisation>
{
  constructor(
    public service: OrganisationService,
    public locals: LocalsService,
  ) {}

  @Get('/clientdata')
  @ApiOperation({
    summary: `Uses the orgId param to get the organiastion and 
  populate the retun data with: areas, contractors and users(Just the kpi users). 
  Used for the client edit screen`,
  })
  clientData(@Res({ passthrough: true }) res: Response) {
    return this.service.getClientData(res);
  }
}
