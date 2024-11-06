// src/seva-form/dto/create-seva-form.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  ValidateIf,
} from 'class-validator';
import { IsInternationalPhone } from '../../common/decorators/IsInternationalPhone';
import { MatchesField } from '../../common/decorators/MatchesField';
import { ValidationMessages } from '../../common/constants/validation-message';

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

  @ValidateIf((o) => o.gotra !== undefined)
  @IsString()
  gotra?: string;

  @IsNotEmpty()
  @IsInternationalPhone()
  mobileNumber: string;

  @IsNotEmpty()
  @IsInternationalPhone()
  @MatchesField('mobileNumber', {
    message: ValidationMessages.mobileNumberConfirmation,
  })
  mobileNumberConfirmation: string;

  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  @IsNumber()
  sevaId: number;
}
