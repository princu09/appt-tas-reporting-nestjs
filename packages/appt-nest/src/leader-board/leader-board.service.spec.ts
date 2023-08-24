import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType } from 'test/helpers/mockType';
import { Repository } from 'typeorm';
import { LeaderBoard } from './entities/leader-board.entity';
import { encrypt } from './leader-board-encryption';
import { LeaderBoardService } from './leader-board.service';

describe('LeaderBoardService', () => {
  let service: LeaderBoardService;
  let repo: MockType<Repository<LeaderBoard>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeaderBoardService,
        {
          provide: getRepositoryToken(LeaderBoard),
          useValue: createMock<Repository<LeaderBoard>>(),
        },
      ],
    }).compile();

    process.env.LB_SECRET_KEY = `9z$C&F)J@NcRfUjXn2r5u8x!A%D*G-Ka`;
    service = module.get<LeaderBoardService>(LeaderBoardService);
    repo = module.get(getRepositoryToken(LeaderBoard));
  });

  it('createGood', async () => {
    const data = encrypt(
      JSON.stringify({
        score: 10,
      }),
    );
    repo.save.mockReturnValue(true);
    await service.create(data);
    expect(repo.save).toBeCalledWith({ score: 10 });
  });

  it('createBad', async () => {
    const data = encrypt(
      JSON.stringify({
        score: 10,
      }),
    );
    data.iv = '1231212312123';
    repo.save.mockReturnValue(true);
    expect(async () => {
      await service.create(data);
    }).rejects.toThrowError();
  });
});
