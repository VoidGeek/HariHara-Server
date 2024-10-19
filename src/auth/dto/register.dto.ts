import { IsEmail, IsString, IsPhoneNumber } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsPhoneNumber('IN') // Validate Indian phone numbers
  phone: string;
}
