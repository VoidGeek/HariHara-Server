import { IsString, IsPostalCode, IsPhoneNumber } from 'class-validator';

export class CreateContactDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsPostalCode('IN') // Ensure postal code is valid for India
  postal_code: string;

  @IsString()
  country: string;

  @IsPhoneNumber('IN') // Only allow Indian phone numbers
  phone: string;
}
