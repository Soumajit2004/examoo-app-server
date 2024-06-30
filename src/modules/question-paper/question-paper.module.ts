import { Module } from '@nestjs/common';

import { QuestionPaperService } from './services/question-paper.service';
import { QuestionPaperController } from './controllers/question-paper.controller';
import { QuestionController } from './controllers/question.controller';
import { QuestionService } from './services/question.service';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../../common/database/database.module';
import { UploadModule } from '../../common/upload/upload.module';

@Module({
  imports: [AuthModule, DatabaseModule, UploadModule],
  providers: [QuestionPaperService, QuestionService],
  controllers: [QuestionPaperController, QuestionController],
})
export class QuestionPaperModule {}
