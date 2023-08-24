import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { Roleuser } from 'src/auto-resources/role-user/role-user.entity';
import { Repository } from 'typeorm';
import { User } from '../auto-resources/user/user.entity';
import { LocalsService } from '../services/locals/locals.service';

@Injectable()
export class ApitokenMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Roleuser)
    private roleUserRepository: Repository<Roleuser>,
    private readonly tokenService: AuthenticationService,
    private readonly locals: LocalsService,
  ) {}

  async use(req: Request, res: Response, next: () => void) {
    if (req.headers.hasOwnProperty('authorization')) {
      const payload = this.tokenService.validateToken(
        req.headers['authorization'],
      );
      if (!payload) {
        throw new ForbiddenException('Invalid api token');
      }

      // Get the user
      this.locals.setToken(res, payload);
      this.locals.setUserId(res, payload.userId);
      const user = await this.userRepository.findOne(payload.userId);
      if (user)
        user.roles = await this.roleUserRepository.find({ owner: user.id });
      this.locals.setUser(res, user);
    }
    next();
  }
}
