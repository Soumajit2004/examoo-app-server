import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../../../../user/entites/user.entity';
import { NumericalAnswer } from './numerical-answer.entity';

@Entity()
export class NumericalResponse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.mcqResponses, { eager: true })
  markerByUser: User;

  @ManyToOne(() => NumericalAnswer, (parentAnswer) => parentAnswer.responses)
  parentAnswer: NumericalResponse;

  @Column('decimal', { precision: 8, scale: 2 })
  value: number;
}
