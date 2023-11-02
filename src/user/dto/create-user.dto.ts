import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  phone: string;
  @IsNotEmpty()
  password: string;
  photo: string;
  @IsNotEmpty()
  school: string;
  @IsNotEmpty()
  address: string;
}
