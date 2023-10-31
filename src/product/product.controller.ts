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
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { PurchaseProductDto } from './dto/purchase-product.dto';

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
  findAll() {
    return this.productService.findAll();
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
}
