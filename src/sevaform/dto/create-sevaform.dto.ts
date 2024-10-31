// src/seva-form/dto/create-seva-form.dto.ts
import { IsNotEmpty, IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateSevaFormDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  nakshathra: string;

  @IsNotEmpty()
  @IsString()
  rashi: string;

  @IsString() // Optional field
  gotra?: string;

  @IsNotEmpty()
  @IsString()
  mobileNumber: string;

  @IsNotEmpty()
  @IsString()
  mobileNumberConfirmation: string;

  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  @IsNumber()
  sevaId: number;
}
