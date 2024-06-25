import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserProfile } from './user-profile.entity';
import { McqResponse } from '../../question-paper/entites/answers/mcq/mcq-response.entity';
import { TextResponse } from '../../question-paper/entites/answers/text/text-response.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToOne(() => UserProfile)
  @JoinColumn()
  profile: UserProfile;

  @OneToMany(() => McqResponse, (response) => response.markerByUser)
  mcqResponses: McqResponse[];

  @OneToMany(() => TextResponse, (response) => response.markerByUser)
  textResponse: TextResponse[];
}
