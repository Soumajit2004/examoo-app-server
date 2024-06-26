import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TextResponse } from './text-response.entity';

@Entity()
export class TextAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  correctText: string;

  @OneToMany(() => TextResponse, (response) => response.parentAnswer, {
    eager: true,
  })
  responses: TextResponse[];
}
