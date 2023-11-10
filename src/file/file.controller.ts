import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { SuccessResponse } from 'src/common/response/response.dto';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('photo/upload')
  @UseInterceptors(FileInterceptor('photo'))
  uploadPhoto(@UploadedFile() file) {
    const uploadedFileName = file.filename;

    return new SuccessResponse('file uploaded', { path: uploadedFileName });
  }
}
