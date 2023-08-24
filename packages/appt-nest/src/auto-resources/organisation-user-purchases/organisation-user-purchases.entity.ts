import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { ApptBaseDTO } from '../../base/appt-base-dto';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ApptBaseEntity } from '../../base/appt-base-entity';
import { OrganisationProduct } from '../organisation-product/organisation-product.entity';

/**
 * Contains the all the purchases made against an organistion
 * by one of the organisations users
 */
@Entity('organisationuserpurchases')
export class OrganisationUserPurchases extends ApptBaseEntity {
  @ManyToOne(() => OrganisationProduct, (product) => product.purchases, {
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'productId' })
  product: OrganisationProduct;
  @Column()
  productId: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  cost: number;

  @ApiProperty({
    description: `Has this been processed by the Appt Ledger`,
  })
  @Column('boolean', { nullable: false, default: false })
  processed: boolean;

  @ApiProperty({
    description: `When a user makes a payment it doesn't automatically get added to the appt bank account this will update to true once we have received it`,
  })
  @Column('boolean', { nullable: false, default: false })
  received: boolean;
}

export class OrganisationUserPurchasesDTO extends ApptBaseDTO {
  @IsUUID()
  productId: string;
}
