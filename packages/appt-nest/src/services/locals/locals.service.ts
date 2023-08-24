import { Injectable } from '@nestjs/common';
import type { Response } from 'express';
import type { TokenPayload } from 'src/authentication/types/token-payload';
import type { ApptBaseEntity } from 'src/base/appt-base-entity';
import type { Organisation } from '../../auto-resources/organisation/organisation.entity';
import type { Site } from '../../auto-resources/site/site.entity';
import type { User } from '../../auto-resources/user/user.entity';

@Injectable()
export class LocalsService {
  gettoken(res: Response): TokenPayload {
    return res.locals._token;
  }
  setToken(res: Response, value: TokenPayload) {
    res.locals._token = value;
  }

  setUserPermissions(res: Response, value: string[]) {
    res.locals._userPermissions = value;
  }

  getInternal(res: Response): boolean {
    return res.locals._internal;
  }
  setInternal(res: Response, value: boolean) {
    res.locals._internal = value;
  }

  getUser(res: Response): User {
    return res.locals._user;
  }
  setUser(res: Response, value: User) {
    res.locals._user = value;
  }

  getUserId(res: Response): string {
    return res.locals._userId;
  }
  setUserId(res: Response, value: string) {
    res.locals._userId = value;
  }

  getOrganisation(res: Response): Organisation {
    return res.locals._organisation;
  }
  setOrganisation(res: Response, value: Organisation) {
    res.locals._organisation = value;
  }

  getSite(res: Response): Site {
    return res.locals._site;
  }
  setSite(res: Response, value: Site) {
    res.locals._site = value;
  }

  getApptBaseEntity(res: Response): Partial<ApptBaseEntity> {
    return {
      organisation: this.getOrganisation(res)?.id,
      site: this.getSite(res)?.id,
      owner: this.getUserId(res),
    };
  }
}
