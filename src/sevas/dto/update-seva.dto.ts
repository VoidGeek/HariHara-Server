import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateSevaDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  name_kannada?: string;

  @IsOptional()
  @IsString()
  description_kannada?: string;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false }) // Using IsNumber for decimal validation
  base_price: number;
}
