import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {
  FailedResponse,
  SuccessResponse,
} from 'src/common/response/response.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
    try {
      await this.prismaService.user.create({
        data: {
          name: createUserDto.name,
          phone: createUserDto.phone,
          email: createUserDto.email,
          password: hashedPassword,
          photo: createUserDto.photo,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new BadRequestException(
            new FailedResponse('cannot create data', {
              exists: true,
              code: e.code,
              message: e.message,
              meta: e.meta?.target,
            }),
          );
        } else {
          throw new BadRequestException(
            new FailedResponse('cannot create data', {
              exists: false,
              code: e.code,
              message: e.message,
              meta: e.meta,
            }),
          );
        }
      }
    }

    return new SuccessResponse('data created');
  }
}
