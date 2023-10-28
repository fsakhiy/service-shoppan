import { Controller, Post, Body, Get, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ValidationPipe } from 'src/validation/validation.pipe';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @UsePipes(ValidationPipe)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('newroute')
  newRoute() {
    return 'testing the persistent postgres data';
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }
}
