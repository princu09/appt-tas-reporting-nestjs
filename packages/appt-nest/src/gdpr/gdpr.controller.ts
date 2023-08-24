import {
  Controller,
  Delete,
  Get,
  Param,
  Res,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { IsGlobalAdminGuard } from 'src/guards/is-global-admin.guard';
import { IsLoggedInGuard } from 'src/guards/is-logged-in.guard';
import { UserHasPermissionGuard } from 'src/guards/user-has-permission.guard';
import { LocalsService } from 'src/services/locals/locals.service';
import {
  DELETE_MY_GDPR_PERMISSION,
  DELETE_OTHER_GDPR_PERMISSION,
  GET_MY_GDPR_PERMISSION,
  GET_OTHER_GDPR_PERMISSION,
} from './gdpr.permissions';
import { GdprService } from './gdpr.service';

@ApiTags('gdpr')
@Controller('gdpr')
@UseGuards(IsLoggedInGuard)
export class GdprController {
  constructor(
    private readonly gdprService: GdprService,
    public readonly locals: LocalsService,
  ) {}

  @Get()
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [GET_MY_GDPR_PERMISSION])
  GetUserGDPR(@Res({ passthrough: true }) res: Response) {
    return this.gdprService.getUserGDPR(this.locals.getUserId(res));
  }

  @Get(':id')
  @UseGuards(UserHasPermissionGuard, IsGlobalAdminGuard)
  @SetMetadata('permissions', [GET_OTHER_GDPR_PERMISSION])
  GetOtherUserGDPR(@Param('id') id: string) {
    return this.gdprService.getUserGDPR(id);
  }

  @Delete()
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [DELETE_MY_GDPR_PERMISSION])
  DeleteUserGDPR(@Res({ passthrough: true }) res: Response) {
    return this.gdprService.deleteUserGDPR(this.locals.getUserId(res));
  }

  @Delete(':id')
  @UseGuards(UserHasPermissionGuard, IsGlobalAdminGuard)
  @SetMetadata('permissions', [DELETE_OTHER_GDPR_PERMISSION])
  DeleteOtherUserGDPR(@Param('id') id: string) {
    return this.gdprService.deleteUserGDPR(id);
  }
}
