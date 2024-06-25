import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { NumericalResponse } from './numerical-response.entity';

@Entity()
export class NumericalAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 8, scale: 2 })
  correctValue: number;

  @OneToMany(() => NumericalResponse, (response) => response.parentAnswer)
  responses: NumericalResponse[];
}
