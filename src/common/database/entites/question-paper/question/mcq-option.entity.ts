import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { McqQuestion } from './mcq-question.entity';

@Entity()
export class McqOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => McqQuestion, (mcqQuestion) => mcqQuestion.mcqOptions, {
    onDelete: 'CASCADE',
  })
  parentMcqQuestion: McqQuestion;

  @Column()
  text: string;

  @Column({ nullable: true })
  imageUrl?: string;
}
