import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { Organisation } from "../../../../src/auto-resources/organisation/organisation.entity";
import { Site } from "../../../../src/auto-resources/site/site.entity";
import { User } from "../../../../src/auto-resources/user/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("testautoapi")
export class TestAutoApi {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column('text')
  text: string;

  @Column('integer')
  someNumber: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "owner" })
  ownerModel: User | null;
  @Column({ nullable: true })
  owner: string | null;

  @ManyToOne(() => Organisation)
  @JoinColumn({ name: "organisation" })
  organisationModel: Organisation | null;
  @Column({ nullable: true })
  organisation: string | null ;

  @ManyToOne(() => Site)
  @JoinColumn({ name: "site" })
  siteModel: Site | null;
  @Column({ nullable: true })
  site: string | null;
}


export class TestAutoApiDTO {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNumber()
  someNumber: number;

  @IsOptional()
  @IsUUID()
  owner: string | null;

  @IsOptional()
  @IsUUID()
  organisation: string | null;

  @IsOptional()
  @IsUUID()
  site: string | null;
}
