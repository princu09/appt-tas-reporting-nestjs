import { IsUUID } from 'class-validator';

export class RelationDTO {
  @IsUUID()
  id: string;
}
