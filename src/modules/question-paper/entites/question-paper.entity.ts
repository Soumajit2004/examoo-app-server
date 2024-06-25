import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entites/user.entity';
import { Question } from './question.entity';

@Entity()
export class QuestionPaper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.questionPapers, { eager: true })
  owner: User;

  @Column({ default: new Date().toISOString() })
  createdOn: string;

  @OneToMany(() => Question, (question) => question.parentQuestionPaper, {
    eager: true,
  })
  questions: Question[];
}
