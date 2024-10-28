import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateSevaDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  name_kannada: string;

  @IsNotEmpty()
  @IsString()
  description_kannada: string;

  @IsNotEmpty()
  @IsNumber({ allowNaN: false, allowInfinity: false }) // Using IsNumber for decimal validation
  base_price: number;
}
