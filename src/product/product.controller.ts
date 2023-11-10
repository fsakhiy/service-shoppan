import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  Request,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { PurchaseProductDto } from './dto/purchase-product.dto';
import { PaginationRequest } from './dto/pagination-request.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { SuccessResponse } from 'src/common/response/response.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  @UsePipes(ValidationPipe)
  create(@Body() createProductDto: CreateProductDto, @Request() req) {
    return this.productService.create(createProductDto, req.user.uuid);
  }

  @Get('all')
  findAll(@Query() query: PaginationRequest) {
    return this.productService.findAll(query);
    // return `page: ${query.page}, size: ${query.size}`;
  }

  @Get('uuid/:uuid')
  findOne(@Param('uuid') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @UseGuards(AuthGuard)
  @Post('buy')
  @UsePipes(ValidationPipe)
  getWALink(@Body() buyProduct: PurchaseProductDto) {
    return this.productService.generateWALink(buyProduct);
  }

  @Post('photo/upload')
  @UseInterceptors(FileInterceptor('photo'))
  async uploadPhoto(@UploadedFile() file) {
    const uploadedFileName = await this.productService.uploadFile(file);

    return new SuccessResponse('file uploaded', { path: uploadedFileName });
  }
}
