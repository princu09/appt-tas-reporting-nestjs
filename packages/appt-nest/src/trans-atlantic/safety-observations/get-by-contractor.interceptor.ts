import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { TransAtRoleTitles } from 'src/auto-resources/user/user.entity';
import { Repository } from 'typeorm';
import { LocalsService } from '../../services/locals/locals.service';
import { OrganisationContractor } from '../organisation-contractor/organisation-contractor.entity';

@Injectable()
export class GetByContractorInterceptor implements NestInterceptor {
  private readonly logger = new Logger(GetByContractorInterceptor.name);

  constructor(
    @InjectRepository(OrganisationContractor)
    public repo: Repository<OrganisationContractor>,
    public locals: LocalsService,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest() as Request;
    const res = context.switchToHttp().getResponse();

    const user = this.locals.getUser(res);
    const orgId = this.locals.getOrganisation(res).id;

    // restrict by contractor ids
    if (user.type === TransAtRoleTitles.APP_ROLE && req.method === 'GET') {
      const contractorIds = (
        await this.repo
          .createQueryBuilder('oc')
          .leftJoinAndSelect('oc.users', 'users')
          .where('users.id = :id AND oc.organisation = :orgId', {
            id: user.id,
            orgId: orgId,
          })
          .getMany()
      ).map((x) => x.id);

      if (req?.query?.s) {
        const tmp = JSON.parse(req.query.s as string);
        tmp['contractorId'] = { $in: contractorIds };
        req.query.s = JSON.stringify(tmp);
      } else {
        req.query.s = JSON.stringify({
          contractorId: { $in: contractorIds },
        });
      }
    }

    return next.handle();
  }
}
