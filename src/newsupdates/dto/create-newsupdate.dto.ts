// create-newsupdate.dto.ts
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateNewsUpdateDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  created_by?: number; // Optional field for storing the user ID
}
