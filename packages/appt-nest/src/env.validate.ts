import { plainToClass } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsPort,
  IsString,
  IsUrl,
  IsUUID,
  Length,
  validateSync,
} from 'class-validator';

class EnvironmentVariables {
  @IsString()
  TYPEORM_HOST: string;
  @IsPort()
  TYPEORM_PORT: string;
  @IsString()
  TYPEORM_DATABASE: string;
  @IsString()
  TYPEORM_USERNAME: string;
  @IsString()
  TYPEORM_PASSWORD: string;
  @IsString()
  TWILIO_ACCOUNT_SID: string;
  @IsString()
  TWILIO_AUTH_TOKEN: string;
  @IsString()
  TWILIO_MESSAGING_SID: string;
  @IsString()
  SENDGRID_KEY: string;
  @IsString()
  GOOGLE_APPLICATION_CREDENTIALS: string;
  @IsString()
  @IsEmail()
  NOTIFICATION_FROM_EMAIL: string;
  @IsString()
  JWT_SECRET: string;
  @IsString()
  JWT_EXP: string;
  @IsUrl()
  SERVER_ADDRESS: string;
  @IsUUID()
  DEFAULT_ORG_UUID: string;

  @IsOptional()
  @Length(32, 32)
  LB_SECRET_KEY: string;

  @IsString()
  AWS_KEY: string;
  @IsString()
  AWS_SECRET: string;
  @IsString()
  AWS_BUCKET: string;
  @IsString()
  AWS_REGION: string;

  @IsString()
  STRIPE_API_KEY: string;
  @IsString()
  STRIPE_WEBHOOK_SECRET: string;

  @IsString()
  TMP_FILE_PATH: string;

  @IsString()
  REDIS_HOST: string;
  @IsPort()
  REDIS_PORT: string;
  @IsString()
  @IsOptional()
  REDIS_USER: string;
  @IsString()
  @IsOptional()
  REDIS_PASSWORD: string;

  @IsOptional()
  @IsString()
  PRODUCTION_REFRESH_COOKIE_NAME: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  // Skip when testing
  if (process.env.NODE_ENV === 'test') return validatedConfig;

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
