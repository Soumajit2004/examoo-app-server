import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../../user/entites/user.entity';
import { TextAnswer } from './text-answer.entity';

@Entity()
export class TextResponse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.textResponse, { eager: true })
  markerByUser: User;

  @ManyToOne(() => TextAnswer, (parentAnswer) => parentAnswer.responses)
  parentAnswer: TextAnswer;

  @Column()
  text: string;
}
