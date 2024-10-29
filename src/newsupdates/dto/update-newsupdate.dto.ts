import { IsString, IsOptional } from 'class-validator';

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
  created_by?: number; // Optional field for storing the user ID
}
