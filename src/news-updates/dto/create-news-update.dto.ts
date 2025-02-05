import {
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateNewsUpdateDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  title_kannada?: string;

  @IsOptional()
  @IsString()
  content_kannada?: string;

  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true }) // Validate each item in the array as a number
  imageIds: number[];
}
