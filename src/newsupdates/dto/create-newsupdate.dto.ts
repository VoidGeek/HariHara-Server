import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateNewsUpdateDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  title_kannada: string;

  @IsNotEmpty()
  @IsString()
  content_kannada: string;

  @IsOptional()
  created_by?: number; // Optional field for storing the user ID
}
