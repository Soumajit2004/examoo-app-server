import { Injectable } from '@nestjs/common';
import { Bucket, Storage } from '@google-cloud/storage';
import * as path from 'node:path';

@Injectable()
export class UploadService {
  private storage = new Storage({
    keyFilename: path.join(__dirname, '../../../gcpServiceAccountKey.json'),
    projectId: 'examoo-app',
  });

  renameFile(id: string, filename: string) {
    const f = filename.split('.');

    return `${id}.${f.pop()}`;
  }

  getBucket(): Bucket {
    return this.storage.bucket('dev-examoo-media');
  }
}
