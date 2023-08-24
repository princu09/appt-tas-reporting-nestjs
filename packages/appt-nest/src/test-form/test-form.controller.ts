import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequestInterceptor } from '@nestjsx/crud';
import { Request, Response } from 'express';
import { defaultCrudPermissionNoRoute } from 'src/auto-api/default-crud-permissions';
import { OrgSiteOwnerPermissionInterceptor } from 'src/auto-api/org-site-owner-permission.interceptor';
import { HasOrganisationGuard } from 'src/guards/has-organisation.guard';
import { HasSiteGuard } from 'src/guards/has-site.guard';
import { IsLoggedInGuard } from 'src/guards/is-logged-in.guard';
import { PermissionsService } from 'src/services/permissions/permissions.service';
import { TestForm, TestFormDTO } from './test-form.entity';
import { TestFormService } from './test-form.service';

@Crud({
  model: {
    type: TestForm,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  dto: {
    update: TestFormDTO,
    create: TestFormDTO,
    replace: TestFormDTO,
  },
  routes: {
    ...defaultCrudPermissionNoRoute('testform'),
    only: [
      'getOneBase',
      'createOneBase',
      'updateOneBase',
      'deleteOneBase',
      'recoverOneBase',
    ],
  },
})
@ApiTags('testform')
@Controller('testform')
@UseInterceptors(OrgSiteOwnerPermissionInterceptor, CrudRequestInterceptor)
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class TestFormController implements CrudController<TestForm> {
  constructor(
    public service: TestFormService,
    private permChecker: PermissionsService,
  ) {}

  @Post('files/:id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'IDPicture', maxCount: 1 }]))
  async uploadFile(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
    @UploadedFiles() files: { IDPicture: Express.Multer.File[] },
  ) {
    const theData = await this.service.repo.findOneOrFail(id);
    const theFile = await this.service.recordService.uploadFiles(
      res,
      files.IDPicture,
    );

    if (!theFile.errors.length) {
      theData.IDPicture = await this.service.recordService.repo.findOneOrFail(
        theData.IDPicture.id,
      );
      await this.service.repo.save(theData);
    }

    return theData;
  }

  @Get(':id')
  async getExisting(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ) {
    const data = await this.service.parseEntityReturn(
      await this.service.repo.findOneOrFail(id),
    );

    if (!(await this.permChecker.userCanAccess(req, res, data)))
      throw new ForbiddenException();

    return {
      data,
      form: this.service.getDynamicForm(data),
    };
  }

  @Get()
  get() {
    return this.service.getDynamicForm();
  }
}
