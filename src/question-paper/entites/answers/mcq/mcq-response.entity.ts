import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../../../user/entites/user.entity';
import { McqOption } from './mcq-option.entity';
import { McqAnswer } from './mcq-answer.entity';

@Entity()
export class McqResponse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.mcqResponses, { eager: true })
  markerByUser: User;

  @ManyToOne(() => McqAnswer, (parentAnswer) => parentAnswer.responses)
  parentAnswer: McqAnswer;

  @OneToOne(() => McqOption)
  @JoinColumn()
  markedOption: McqOption;
}
