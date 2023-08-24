import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { enc } from './leader-board-encryption';
import { LeaderBoardService } from './leader-board.service';

@ApiTags('leader-board')
@Controller('leader-board')
export class LeaderBoardController {
  constructor(private readonly leaderBoardService: LeaderBoardService) {}

  @Post()
  create(@Body() encrypted: enc) {
    return this.leaderBoardService.create(encrypted);
  }

  @Get()
  findAll(
    @Param('limit') limit: number | null,
    @Param('skip') skip: number | null,
  ) {
    return this.leaderBoardService.findAll(limit, skip);
  }
}
