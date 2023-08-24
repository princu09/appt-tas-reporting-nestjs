import { ValidatorConstraintInterface } from 'class-validator';
import { Repository } from 'typeorm';

interface ObjectWithID {
  id: number | string;
}

export class GenericExistsValidator<T extends ObjectWithID>
  implements ValidatorConstraintInterface
{
  constructor(public repo: Repository<T>, public message: string) {}
  async validate(id: number | string) {
    try {
      return (
        (await this.repo.count({
          where: { id: id },
        })) > 0
      );
    } catch (e) {
      return false;
    }
  }
  defaultMessage() {
    return this.message;
  }
}
