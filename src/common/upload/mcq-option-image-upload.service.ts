import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UploadService } from './upload.service';

@Injectable()
export class McqOptionImageUploadService {
  logger = new Logger(McqOptionImageUploadService.name);

  private readonly PATH = 'media/mcqOption/';

  constructor(private readonly uploadService: UploadService) {}

  async uploadImage(optionId: string, imageFile: Express.Multer.File) {
    const bucket = this.uploadService.getBucket();

    const filePath =
      this.PATH +
      this.uploadService.renameFile(optionId, imageFile.originalname);

    const file = bucket.file(filePath);

    try {
      await file.save(imageFile.buffer, { resumable: false, gzip: true });
    } catch (err) {
      this.logger.error(err.message);

      throw new InternalServerErrorException('failed to upload option image');
    }

    this.logger.verbose(`Successfully uploaded image for option ${optionId}`);
    return filePath;
  }
}
