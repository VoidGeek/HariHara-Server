import {
  IsEmail,
  IsString,
  IsPhoneNumber,
  IsOptional,
  IsInt,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsPhoneNumber('IN') // Validate Indian phone numbers
  phone: string;

  @IsOptional() // This field is optional
  @IsInt() // Ensure role_id is an integer if provided
  role_id?: number; // Optional role_id, can be provided if needed
}
