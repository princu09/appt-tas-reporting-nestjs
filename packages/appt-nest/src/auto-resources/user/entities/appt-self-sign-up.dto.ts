import { IsEmail, IsString } from 'class-validator';

export class SelfSignUpDTO {
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  password: string;
}
