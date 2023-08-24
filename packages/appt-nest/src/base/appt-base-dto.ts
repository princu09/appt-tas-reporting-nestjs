import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export abstract class ApptBaseDTO {
  @IsOptional()
  @IsUUID()
  owner?: string | null;

  @IsOptional()
  @IsUUID()
  organisation?: string | null;

  @IsOptional()
  @IsUUID()
  site?: string | null;

  @IsOptional()
  @IsUUID()
  id?: string | null;
  @IsOptional()
  @IsDateString()
  deletedAt?: string | null;
  @IsOptional()
  @IsDateString()
  createdAt?: string | null;
  @IsOptional()
  @IsDateString()
  updatedAt?: string | null;
}

export abstract class ApptBaseNotNullDTO {
  @IsUUID()
  owner?: string | null;

  @IsUUID()
  organisation?: string | null;

  @IsOptional()
  @IsUUID()
  site?: string | null;

  @IsOptional()
  @IsUUID()
  id?: string | null;
  @IsOptional()
  @IsDateString()
  deletedAt?: string | null;
  @IsOptional()
  @IsDateString()
  createdAt?: string | null;
  @IsOptional()
  @IsDateString()
  updatedAt?: string | null;
}
