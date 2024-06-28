import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
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

  @OneToOne(() => McqQuestion)
  @JoinColumn()
  @Exclude({ toPlainOnly: true })
  answer: McqOption;

  @OneToMany(() => McqOption, (mcqOption) => mcqOption.parentMcqQuestion, {
    eager: true,
  })
  mcqOptions: McqOption[];
}
