import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApptBaseDTO } from '../../base/appt-base-dto';
import { Column, Entity, OneToMany } from 'typeorm';
import { ApptBaseEntity } from '../../base/appt-base-entity';
import { OrganisationUserPurchases } from '../organisation-user-purchases/organisation-user-purchases.entity';

@Entity('OrganisationProduct')
export class OrganisationProduct extends ApptBaseEntity {
  @Column('text', { nullable: true })
  description: string | null;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  cost: number;

  @ApiProperty({
    description:
      'Is this product active to be purchased by the organisations users',
  })
  @Column('boolean', { default: false })
  active: boolean;

  @OneToMany(() => OrganisationUserPurchases, (purchase) => purchase.product)
  purchases: OrganisationUserPurchases[];
}

export class OrganisationProductDTO extends ApptBaseDTO {
  @IsNumber()
  cost: number;

  @IsOptional()
  @IsString()
  description: string | null;

  @IsOptional()
  @IsBoolean()
  active: boolean | null;
}
