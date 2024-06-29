import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { QuestionPaper } from './question-paper.entity';
import { Exclude } from 'class-transformer';

enum QuestionType {
  MCQ = 'mcq',
  TEXT = 'text',
  NUMERICAL = 'numerical',
}

@Entity()
export class NumericalQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'mediumtext' })
  questionText: string;

  @ManyToOne(
    () => QuestionPaper,
    (questionPaper) => questionPaper.mcqQuestions,
    { onDelete: 'CASCADE' },
  )
  @Exclude({ toPlainOnly: true })
  parentQuestionPaper: QuestionPaper;

  @Column({ type: 'enum', enum: QuestionType, default: QuestionType.NUMERICAL })
  questionType: QuestionType;

  @Column({ default: false })
  answerAdded: boolean;

  @Column({ type: 'float', nullable: true })
  @Exclude({ toPlainOnly: true })
  answer?: number;
}
