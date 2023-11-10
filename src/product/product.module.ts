import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';

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
  controllers: [ProductController],
  providers: [ProductService, PrismaService],
})
export class ProductModule {}
