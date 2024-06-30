import { Module } from '@nestjs/common';
import { QuestionImageUploadService } from './question-image-upload.service';

@Module({
  providers: [QuestionImageUploadService],
})
export class UplaodModule {}
