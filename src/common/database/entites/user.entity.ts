import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { QuestionPaper } from './question-paper/question-paper.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => QuestionPaper, (questionPaper) => questionPaper.owner)
  questionPapers: QuestionPaper[];
}
