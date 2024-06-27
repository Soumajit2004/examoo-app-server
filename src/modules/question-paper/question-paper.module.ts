import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuestionPaperService } from './services/question-paper.service';
import { QuestionPaperController } from './controllers/question-paper.controller';
import { QuestionController } from './controllers/question.controller';
import { QuestionService } from './services/question.service';
import { Question } from './entites/question.entity';
import { QuestionPaper } from './entites/question-paper.entity';
import { QuestionPaperRepository } from '../../database/repositories/question-paper.repository';
import { QuestionRepository } from '../../database/repositories/question.repository';
import { AuthModule } from '../auth/auth.module';
import { QuestionPaperAccessControlService } from './services/question-paper-access-control.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionPaper, Question]), AuthModule],
  providers: [
    QuestionPaperService,
    QuestionService,
    QuestionPaperRepository,
    QuestionRepository,
    QuestionPaperAccessControlService,
  ],
  controllers: [QuestionPaperController, QuestionController],
})
export class QuestionPaperModule {}
