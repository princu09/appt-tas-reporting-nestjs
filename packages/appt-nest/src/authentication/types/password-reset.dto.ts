import { IsString, IsUUID } from 'class-validator';

export class PasswordResetDTO {
  @IsUUID()
  token: string;

  @IsString()
  password: string;
}
