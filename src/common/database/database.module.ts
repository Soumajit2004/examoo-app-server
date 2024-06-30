import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserProfile } from './entites/user/user-profile.entity';
import { User } from './entites/user/user.entity';
import { QuestionPaper } from './entites/question-paper/question-paper.entity';
import { McqQuestion } from './entites/question-paper/question/mcq-question.entity';
import { McqOption } from './entites/question-paper/question/mcq-option.entity';
import { NumericalQuestion } from './entites/question-paper/question/numerical-question.entity';
import { TextQuestion } from './entites/question-paper/question/text-question.entity';
import { QuestionPaperRepository } from './repositories/question-paper/question-paper.repository';
import { McqQuestionRepository } from './repositories/question-paper/question/mcq-question.repository';
import { NumericalQuestionRepository } from './repositories/question-paper/question/numerical-question.repository';
import { TextQuestionRepository } from './repositories/question-paper/question/text-question.repository';
import { UserRepository } from './repositories/user.repository';
import { McqOptionRepository } from './repositories/question-paper/question/mcq-option.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserProfile,
      QuestionPaper,
      McqQuestion,
      McqOption,
      NumericalQuestion,
      TextQuestion,
    ]),
  ],
  providers: [
    UserRepository,
    QuestionPaperRepository,
    McqQuestionRepository,
    NumericalQuestionRepository,
    TextQuestionRepository,
    McqOptionRepository,
  ],
  exports: [
    UserRepository,
    QuestionPaperRepository,
    McqQuestionRepository,
    NumericalQuestionRepository,
    TextQuestionRepository,
    McqOptionRepository,
  ],
})
export class DatabaseModule {}
