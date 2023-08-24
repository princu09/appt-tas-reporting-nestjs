import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Cookies } from 'src/helper/cookie.decorator';
import {
  AuthenticationService,
  LoginReturn,
  refreshTokenCookieName,
} from './authentication.service';
import { LoginDTO } from './types/login.dto';
import { PasswordResetRequestDTO } from './types/password-reset-request.dto';
import { PasswordResetDTO } from './types/password-reset.dto';

@ApiTags('authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('login')
  @ApiOperation({
    summary:
      'This will log in a user and return some default information about them. It will also return a cookie that can be used to refresh your api token rather than having to re log in.',
  })
  login(
    @Res({ passthrough: true }) res: Response,
    @Body() data: LoginDTO,
  ): Promise<LoginReturn> {
    return this.authService.login(data, res);
  }

  @Get('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.clearAuthCookie(res);
  }

  @Get('refresh')
  @ApiOperation({
    summary:
      'Call this endpoint to refresh your api token before it expires. The cookie it wants will be returned from the /login request.',
  })
  tokenRefresh(
    @Cookies(refreshTokenCookieName) refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ): { token: string } {
    // validate
    const payload = this.authService.validateRefreshToken(refreshToken);
    if (!payload) throw new ForbiddenException();

    // Attach the new cookie
    this.authService.cookieRefreshToken(res, payload.userId);

    // Return new auth token
    return { token: this.authService.generateToken(payload.userId) };
  }

  @Post('password-reset')
  passwordReset(@Body() body: PasswordResetDTO) {
    return this.authService.passwordReset(body);
  }

  @Post('request/password-reset')
  @UseGuards()
  passwordResetRequest(@Body() body: PasswordResetRequestDTO) {
    return this.authService.passwordResetRequest(body);
  }
}
