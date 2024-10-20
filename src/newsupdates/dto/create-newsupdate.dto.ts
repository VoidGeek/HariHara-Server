// create-newsupdate.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNewsUpdateDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  created_by?: number; // Optional field for storing the user ID
}
