import { IsString, IsOptional } from 'class-validator';

export class UpdateNewsUpdateDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  created_by?: number; // Optional field for storing the user ID
}
