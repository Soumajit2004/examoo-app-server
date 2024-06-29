import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entites/user.entity';
import { McqQuestion } from './mcq-question.entity';
import { TextQuestion } from './text-question.entity';
import { NumericalQuestion } from './numerical-question.entity';

export enum QuestionType {
  MCQ = 'mcq',
  TEXT = 'text',
  NUMERICAL = 'numerical',
}

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

  @OneToMany(
    () => McqQuestion,
    (mcqQuestion) => mcqQuestion.parentQuestionPaper,
    {
      eager: true,
      onDelete: 'CASCADE',
    },
  )
  mcqQuestions: McqQuestion[];

  @OneToMany(
    () => NumericalQuestion,
    (numericalQuestion) => numericalQuestion.parentQuestionPaper,
    {
      eager: true,
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  numericalQuestions: NumericalQuestion[];

  @OneToMany(
    () => TextQuestion,
    (textQuestion) => textQuestion.parentQuestionPaper,
    {
      eager: true,
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  textQuestions: TextQuestion[];
}
