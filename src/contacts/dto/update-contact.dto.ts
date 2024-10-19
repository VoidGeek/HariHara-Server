import {
  IsString,
  IsPostalCode,
  IsPhoneNumber,
  IsOptional,
} from 'class-validator';

export class UpdateContactDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsPostalCode('IN') // Indian postal code validation
  postal_code?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsPhoneNumber('IN') // Allow only Indian phone numbers (+91)
  phone?: string;
}
