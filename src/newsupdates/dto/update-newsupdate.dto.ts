import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateNewsUpdateDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsNotEmpty()
  created_by?: number; // Optional field for storing the user ID
}
