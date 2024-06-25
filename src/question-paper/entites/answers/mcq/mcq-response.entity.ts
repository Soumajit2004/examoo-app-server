import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../../../user/entites/user.entity';
import { McqOption } from './mcq-option.entity';

@Entity()
export class McqResponse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.mcqResponses, { eager: true })
  user: User;

  @OneToOne(() => McqOption)
  @JoinColumn()
  markedOption: McqOption;
}
