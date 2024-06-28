import { TextQuestion } from '../../entites/text-question.entity';
import { NumericalQuestion } from '../../entites/numerical-question.entity';
import { McqQuestion } from '../../entites/mcq-question.entity';
import { User } from '../../../user/entites/user.entity';

export class QuestionPaperResponseDto {
  id: string;

  name: string;

  owner: User;

  candidates: User[];

  createdOn: string;

  questions: (McqQuestion | NumericalQuestion | TextQuestion)[];
}
