import { IsOptional, IsArray, IsNumber, IsString } from 'class-validator';

export class UpdateNewsUpdateDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  title_kannada?: string;

  @IsOptional()
  @IsString()
  content_kannada?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true }) // Validate each item in the array as a number
  imageIds?: number[];
}
