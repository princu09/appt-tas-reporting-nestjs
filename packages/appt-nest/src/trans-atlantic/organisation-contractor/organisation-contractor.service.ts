import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Response } from 'express';
import { OrganisationService } from 'src/auto-resources/organisation/organisation.service';
import { User } from 'src/auto-resources/user/user.entity';
import { LocalsService } from 'src/services/locals/locals.service';
import { Repository } from 'typeorm';
import {
  OrganisationContractor,
  OrganisationContractorAssignDTO,
} from './organisation-contractor.entity';

@Injectable()
export class OrganisationContractorService extends TypeOrmCrudService<OrganisationContractor> {
  constructor(
    @InjectRepository(OrganisationContractor)
    public repo: Repository<OrganisationContractor>,
    @InjectRepository(User) public userRepo: Repository<User>,
    protected orgService: OrganisationService,
    private locals: LocalsService,
  ) {
    super(repo);
  }

  async getDefaultOrgContractor(orgId: string) {
    return this.repo.findOne({
      organisation: orgId,
      default: true,
    });
  }

  async findByUser(userId: string) {
    return this.repo
      .createQueryBuilder('oc')
      .leftJoinAndSelect('oc.users', 'users')
      .where('users.id = :id', { id: userId })
      .getMany();
  }

  async assignUser(
    res: Response,
    dto: OrganisationContractorAssignDTO,
    orgContractorId: string,
  ) {
    const orgContractor = await this.repo.findOne(orgContractorId, {
      relations: ['users'],
    });
    const user = await this.userRepo.findOne(dto.userId, {
      relations: ['contractors'],
    });

    if (!orgContractor)
      throw new BadRequestException(`Invalid Organisation Contractor id`);
    if (!user) throw new BadRequestException(`Invalid user id`);
    // Check org contractor belongs to this org
    if (orgContractor.organisation !== this.locals.getOrganisation(res).id)
      throw new BadRequestException(
        'Organisation Contractor does not belong to this organisation',
      );

    // Check user belongs to this org
    if (
      !this.orgService.userInOrganisation(
        user.id,
        this.locals.getOrganisation(res).id,
      )
    )
      throw new BadRequestException('User is not in this organisation');

    // Remove old one
    if (user.contractors?.length) {
      user.contractors = user.contractors.filter(
        (x) => x.organisation !== this.locals.getOrganisation(res).id,
      );
      await this.userRepo.save(user);
    }

    // Add the new one
    user.contractors.push(orgContractor);
    await this.userRepo.save(user);
  }
}
