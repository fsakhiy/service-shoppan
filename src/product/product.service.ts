import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  FailedResponse,
  SuccessResponse,
} from 'src/common/response/response.dto';
import { Product } from './entities/product.entity';
import { PurchaseProductDto } from './dto/purchase-product.dto';
import { PaginationRequest } from './dto/pagination-request.dto';
import { Meta } from 'src/common/response/meta.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createProductDto: CreateProductDto, userId: string) {
    try {
      await this.prismaService.product.create({
        data: {
          name: createProductDto.name,
          category: createProductDto.category,
          price: createProductDto.price,
          slogan: createProductDto.slogan,
          description: createProductDto.description,
          sellerId: userId,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(
          new FailedResponse('cannot create data', {
            code: e.code,
            message: e.message,
            meta: e.meta,
          }),
        );
      }
    }

    return new SuccessResponse('successfully created data');
  }

  async findAll(query: PaginationRequest) {
    const page = Number.isNaN(query.page - 0) ? 1 : query.page - 0;
    const size = Number.isNaN(query.size - 0) ? 100 : query.size - 0;
    const skipSize = (page - 1) * size;

    const items = await this.prismaService.product.findMany({
      include: {
        seller: true,
      },
      take: size,
      skip: skipSize,
    });

    const totalItems = await this.prismaService.product.count();

    const formattedItems: Product[] = [];
    items.forEach((item) => {
      const formattedItem: Product = {
        uuid: item.uuid,
        name: item.name,
        category: item.category,
        description: item.description,
        photo: item.photo,
        price: item.price,
        seller: item.seller.name,
      };
      formattedItems.push(formattedItem);
    });

    const totalPages = Math.ceil(totalItems / size);

    const meta: Meta = {
      currentPage: page,
      pageSize: size,
      totalData: totalItems,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    };

    return new SuccessResponse('data retrieved', formattedItems, meta);
  }

  async findOne(id: string) {
    const product = await this.prismaService.product.findFirst({
      where: {
        uuid: id,
      },
      include: {
        seller: true,
      },
    });

    if (!product) {
      throw new NotFoundException(
        new FailedResponse('data not found', { exists: false }),
      );
    }

    const formattedProduct: Product = {
      uuid: product.uuid,
      name: product.name,
      category: product.category,
      description: product.description,
      photo: product.photo,
      price: product.price,
      seller: product.seller.name,
    };

    return new SuccessResponse('data retrieved', formattedProduct);
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    try {
      await this.prismaService.product.delete({
        where: {
          uuid: id,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(
          new FailedResponse('cannot delete data', {
            code: e.code,
            message: e.message,
          }),
        );
      }

      throw new BadRequestException(
        new FailedResponse('cannot delete data', { message: e }),
      );
    }
  }

  async generateWALink(buyProduct: PurchaseProductDto) {
    const productData = await this.prismaService.product.findFirst({
      where: {
        uuid: buyProduct.productId,
      },
      include: {
        seller: true,
      },
    });

    if (!productData) {
      throw new NotFoundException(
        new FailedResponse('product not found', { exists: false }),
      );
    }

    const message = `Halo!\n saya tertarik dengan produk ${productData.name}. dan saya berniat untuk membeli sebanyak ${buyProduct.quantity} buah.\nApakah produk ini ready?`;
    const encodedMessage = encodeURI(message);
    const link = `https://wa.me/${productData.seller.phone}?text=${encodedMessage}`;

    return new SuccessResponse('success', { link: link });
  }
}
