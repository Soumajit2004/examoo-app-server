import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { QuestionPaper } from './question-paper.entity';
import { McqOption } from './mcq-option.entity';

enum QuestionType {
  MCQ = 'mcq',
  TEXT = 'text',
  NUMERICAL = 'numerical',
}

@Entity()
export class McqQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'mediumtext' })
  questionText: string;

  @ManyToOne(() => QuestionPaper, (questionPaper) => questionPaper.mcqQuestions)
  @Exclude({ toPlainOnly: true })
  parentQuestionPaper: QuestionPaper;

  @Column({ type: 'enum', enum: QuestionType, default: QuestionType.MCQ })
  questionType: QuestionType;

  @Column({ default: false })
  answerAdded: boolean;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  answer: string;

  @OneToMany(() => McqOption, (mcqOption) => mcqOption.parentMcqQuestion, {
    eager: true,
  })
  mcqOptions: McqOption[];
}
