import { User } from '../../../../common/database/entites/user/user.entity';
import { McqQuestion } from '../../../../common/database/entites/question-paper/question/mcq-question.entity';
import { NumericalQuestion } from '../../../../common/database/entites/question-paper/question/numerical-question.entity';
import { TextQuestion } from '../../../../common/database/entites/question-paper/question/text-question.entity';

export class QuestionPaperResponseDto {
  id: string;

  name: string;

  owner: User;

  createdOn: string;

  questions: (McqQuestion | NumericalQuestion | TextQuestion)[];
}
