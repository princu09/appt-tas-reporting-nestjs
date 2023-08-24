import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validateOrReject } from 'class-validator';
import { Repository } from 'typeorm';
import { LeaderBoard } from './entities/leader-board.entity';
import { decrypt, enc } from './leader-board-encryption';

@Injectable()
export class LeaderBoardService {
  constructor(
    @InjectRepository(LeaderBoard) public repo: Repository<LeaderBoard>,
  ) {}

  async create(encrypted: enc) {
    try {
      const data = decrypt(encrypted);
      const createDTO = Object.assign(new LeaderBoard(), JSON.parse(data));
      await validateOrReject(createDTO);
      await this.repo.save(createDTO);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  findAll(limit: number | null, skip: number | null) {
    return this.repo.find({
      order: {
        score: 'DESC',
      },
      ...(limit && { take: limit }),
      ...(skip && { skip: skip }),
    });
  }
}
