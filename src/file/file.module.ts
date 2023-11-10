import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
@Module({
  imports: [
    MulterModule.register({
      dest: './public',
      fileFilter: (req, file, callback) => {
        if (file.mimetype.startsWith('image/')) {
          callback(null, true);
        } else {
          callback(new Error('file is not an image'), false);
        }
      },
      storage: diskStorage({
        destination: './public',
        filename: (req, file, callback) => {
          const uniqueFileName = uuid();
          callback(null, `${uniqueFileName}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
