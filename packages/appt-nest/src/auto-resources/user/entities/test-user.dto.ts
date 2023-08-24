import { IsOptional, IsString } from 'class-validator';

export class TestUserDTO {
  @IsString()
  email?: string;
  @IsString()
  password?: string;
  @IsString()
  @IsOptional()
  organisation?: string;
}

export class TestUserDTO2 {
  @IsString()
  email: string;
}
