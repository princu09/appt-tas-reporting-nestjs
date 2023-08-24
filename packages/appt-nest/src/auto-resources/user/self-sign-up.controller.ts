import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SelfSignUpDTO } from './entities/appt-self-sign-up.dto';
import { UserService } from './user.service';

@ApiTags('selfsignup')
@Controller('selfsignup')
export class SelfSignUpController {
  constructor(public service: UserService) {}

  @Post('/ssu/start')
  startSingleSignOn(@Body() userDTO: SelfSignUpDTO) {
    return this.service.startSelfSignOn(userDTO);
  }
}
