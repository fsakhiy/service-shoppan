import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {
  FailedResponse,
  SuccessResponse,
} from 'src/common/response/response.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Profile } from './entities/profile.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

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
          school: createUserDto.school,
          address: createUserDto.address,
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

  async login(loginDto: LoginDto) {
    const userInfo = await this.prismaService.user.findUnique({
      where: {
        email: loginDto.email,
      },
    });
    if (!userInfo) {
      throw new UnauthorizedException(
        new FailedResponse('Invalid Credentials', { credentials: false }),
      );
    }
    if (await bcrypt.compare(loginDto.password, userInfo.password)) {
      const payload = {
        uuid: userInfo.uuid,
      };
      const token = await this.jwtService.sign(payload);
      return new SuccessResponse('Login successfull', { token: token });
    } else {
      throw new UnauthorizedException(
        new FailedResponse('Invalid Credentials', { credentials: false }),
      );
    }
  }

  async getProfile(uuid: string) {
    const profile = await this.prismaService.user.findUnique({
      where: {
        uuid: uuid,
      },
    });
    const profileFormatted: Profile = {
      name: profile.name,
      photo: profile.photo,
      address: profile.address,
      school: profile.school,
    };
    return new SuccessResponse('data retrieve', profileFormatted);
  }
}
