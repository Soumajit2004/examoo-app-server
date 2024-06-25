import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class NumericalAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
