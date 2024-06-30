import { Module } from '@nestjs/common';
import { QuestionImageUploadService } from './question-paper/question-image-upload.service';
import { UploadService } from './upload.service';
import { McqOptionImageUploadService } from './question-paper/mcq-option-image-upload.service';

@Module({
  providers: [
    QuestionImageUploadService,
    McqOptionImageUploadService,
    UploadService,
  ],
  exports: [QuestionImageUploadService, McqOptionImageUploadService],
})
export class UploadModule {}
