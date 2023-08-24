import { IsNumber } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('leaderboard')
export class LeaderBoard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNumber()
  score: number;
}
