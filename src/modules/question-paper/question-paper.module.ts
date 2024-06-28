import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuestionPaperService } from './services/question-paper.service';
import { QuestionPaperController } from './controllers/question-paper.controller';
import { QuestionController } from './controllers/question.controller';
import { QuestionService } from './services/question.service';
import { McqQuestion } from './entites/mcq-question.entity';
import { QuestionPaper } from './entites/question-paper.entity';
import { QuestionPaperRepository } from '../../database/repositories/question-paper.repository';
import { McqQuestionRepository } from '../../database/repositories/mcq-question.repository';
import { AuthModule } from '../auth/auth.module';
import { QuestionPaperAccessControlService } from './services/question-paper-access-control.service';
import { McqOption } from './entites/mcq-option.entity';
import { NumericalQuestion } from './entites/numerical-question.entity';
import { TextQuestion } from './entites/text-question.entity';
import { NumericalQuestionRepository } from '../../database/repositories/numerical-question.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuestionPaper,
      McqQuestion,
      McqOption,
      NumericalQuestion,
      TextQuestion,
    ]),
    AuthModule,
  ],
  providers: [
    QuestionPaperService,
    QuestionService,
    QuestionPaperRepository,
    McqQuestionRepository,
    NumericalQuestionRepository,
    QuestionPaperAccessControlService,
  ],
  controllers: [QuestionPaperController, QuestionController],
})
export class QuestionPaperModule {}
