import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { McqAnswer } from './mcq-answer.entity';

@Entity()
export class McqOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => McqAnswer, (parentAnswer) => parentAnswer.options)
  parentAnswer: McqAnswer;

  @Column()
  text: string;

  @Column()
  imageUrl: string;
}
