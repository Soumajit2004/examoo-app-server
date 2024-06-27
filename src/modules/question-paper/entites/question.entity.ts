import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { QuestionPaper } from './question-paper.entity';
import { Exclude } from 'class-transformer';

export enum QuestionType {
  MCQ = 'mcq',
  TEXT = 'text',
  NUMERICAL = 'numerical',
}

@Entity()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'mediumtext' })
  questionText: string;

  @ManyToOne(() => QuestionPaper, (questionPaper) => questionPaper.questions)
  @Exclude({ toPlainOnly: true })
  parentQuestionPaper: QuestionPaper;

  @Column({ type: 'enum', enum: QuestionType })
  questionType: QuestionType;

  @Column({ default: false })
  answerAdded: boolean;
}
