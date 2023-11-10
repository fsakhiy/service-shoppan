import {
  Controller,
  Post,
  Body,
  Get,
  UsePipes,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

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

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    // return req.user.uuid;
    return this.userService.getProfile(req.user.uuid);
  }

  @UseGuards(AuthGuard)
  @Put('update')
  @UsePipes(ValidationPipe)
  updateProfile(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    return this.userService.updateProfile(updateUserDto, req.user.uuid);
  }
}
