import {
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { McqOption } from './mcq-option.entity';
import { McqResponse } from './mcq-response.entity';

@Entity()
export class McqAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => McqOption)
  @JoinColumn()
  correctOption: McqOption;

  @OneToMany(() => McqOption, (option) => option.parentAnswer, { eager: true })
  options: McqOption[];

  @OneToMany(() => McqResponse, (response) => response.parentAnswer)
  responses: McqResponse[];
}
