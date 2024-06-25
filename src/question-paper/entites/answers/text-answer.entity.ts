import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TextAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
