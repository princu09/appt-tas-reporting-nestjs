import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidatorConstraint } from 'class-validator';
import { User } from '../auto-resources/user/user.entity';
import { Repository } from 'typeorm';
import { GenericExistsValidator } from './generic-exists-validator';

@ValidatorConstraint()
@Injectable()
export class UserExists extends GenericExistsValidator<User> {
  constructor(
    @InjectRepository(User)
    repo: Repository<User>,
  ) {
    super(repo, `User doesn't exist`);
  }
}
