import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuestionPaperService } from './services/question-paper.service';
import { QuestionPaperController } from './controllers/question-paper.controller';
import { QuestionController } from './controllers/question.controller';
import { QuestionService } from './services/question.service';
import { Question } from './entites/question.entity';
import { McqAnswer } from './entites/answers/mcq/mcq-answer.entity';
import { TextAnswer } from './entites/answers/text-answer.entity';
import { NumericalAnswer } from './entites/answers/numerical-answer.entity';
import { McqOption } from './entites/answers/mcq/mcq-option.entity';
import { McqResponse } from './entites/answers/mcq/mcq-response.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Question,
      McqAnswer,
      McqResponse,
      McqOption,
      TextAnswer,
      NumericalAnswer,
    ]),
  ],
  providers: [QuestionPaperService, QuestionService],
  controllers: [QuestionPaperController, QuestionController],
})
export class QuestionPaperModule {}
