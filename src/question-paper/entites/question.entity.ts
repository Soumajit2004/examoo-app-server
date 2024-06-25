import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { McqAnswer } from './answers/mcq/mcq-answer.entity';
import { TextAnswer } from './answers/text/text-answer.entity';
import { NumericalAnswer } from './answers/numerical/numerical-answer.entity';
import { QuestionPaper } from './question-paper.entity';

export enum QuestionType {
  MCQ = 'mcq',
  TEXT = 'text',
  NUMERICAL = 'numerical',
}

@Entity()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  questionText: string;

  @ManyToOne(() => QuestionPaper, (questionPaper) => questionPaper.questions)
  parentQuestionPaper: QuestionPaper;

  @Column({ type: 'enum', enum: QuestionType })
  questionType: QuestionType;

  @OneToOne(() => McqAnswer)
  @JoinColumn()
  mcqAnswer: McqAnswer;

  @OneToOne(() => TextAnswer)
  @JoinColumn()
  textAnswer: TextAnswer;

  @OneToOne(() => NumericalAnswer)
  @JoinColumn()
  numericalAnswer: NumericalAnswer;
}
