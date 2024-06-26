import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuestionPaperService } from './services/question-paper.service';
import { QuestionPaperController } from './controllers/question-paper.controller';
import { QuestionController } from './controllers/question.controller';
import { QuestionService } from './services/question.service';
import { Question } from './entites/question.entity';
import { McqAnswer } from './entites/answers/mcq/mcq-answer.entity';
import { TextAnswer } from './entites/answers/text/text-answer.entity';
import { NumericalAnswer } from './entites/answers/numerical/numerical-answer.entity';
import { McqOption } from './entites/answers/mcq/mcq-option.entity';
import { McqResponse } from './entites/answers/mcq/mcq-response.entity';
import { TextResponse } from './entites/answers/text/text-response.entity';
import { NumericalResponse } from './entites/answers/numerical/numerical-response.entity';
import { QuestionPaper } from './entites/question-paper.entity';
import { QuestionPaperRepository } from '../../database/repositories/question-paper.repository';
import { QuestionRepository } from '../../database/repositories/question.repository';
import { AuthModule } from '../auth/auth.module';
import { AnswerController } from './controllers/answer.controller';
import { QuestionPaperAccessControlService } from './services/question-paper-access-control.service';
import { AnswerService } from './services/answer.service';
import { TextAnswerRepository } from '../../database/repositories/answer/text-answer.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuestionPaper,
      Question,
      McqAnswer,
      McqResponse,
      McqOption,
      TextAnswer,
      TextResponse,
      NumericalAnswer,
      NumericalResponse,
    ]),
    AuthModule,
  ],
  providers: [
    QuestionPaperService,
    QuestionService,
    QuestionPaperRepository,
    QuestionRepository,
    QuestionPaperAccessControlService,
    AnswerService,
    TextAnswerRepository,
  ],
  controllers: [QuestionPaperController, QuestionController, AnswerController],
})
export class QuestionPaperModule {}
