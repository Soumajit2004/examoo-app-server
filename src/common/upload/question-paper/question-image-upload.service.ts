import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UploadService } from '../upload.service';

@Injectable()
export class QuestionImageUploadService {
  logger = new Logger(QuestionImageUploadService.name);

  private readonly PATH = 'media/questionImages/';

  constructor(private readonly uploadService: UploadService) {}

  async uploadImage(questionId: string, imageFile: Express.Multer.File) {
    const bucket = this.uploadService.getBucket();

    const filePath =
      this.PATH +
      this.uploadService.renameFile(questionId, imageFile.originalname);

    const file = bucket.file(filePath);

    try {
      await file.save(imageFile.buffer, { resumable: false, gzip: true });
    } catch (err) {
      this.logger.error(err.message);

      throw new InternalServerErrorException('failed to upload image');
    }

    this.logger.verbose(
      `Successfully uploaded image for question ${questionId}`,
    );
    return filePath;
  }
}
