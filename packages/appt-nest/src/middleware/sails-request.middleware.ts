import { Injectable, NestMiddleware } from '@nestjs/common';
import * as dns from 'dns';
import { LocalsService } from '../services/locals/locals.service';

@Injectable()
export class SailsRequestMiddleware implements NestMiddleware {
  constructor(private readonly locals: LocalsService) {}
  use(req: any, res: any, next: () => void) {
    // Not internal
    this.locals.setInternal(res, false);

    let ip =
      req.headers['x-forwarded-for']?.split(',').shift() ||
      req.socket?.remoteAddress;

    ip = ip.replace('::ffff:', '');

    // Check if request came from flytt-core
    dns.resolve('core', (error, addresses) => {
      if (error) return next();
      for (const addr of addresses) {
        if (addr.includes(ip)) {
          this.locals.setInternal(res, true);
          return next();
        }
      }
      return next();
    });
  }
}
