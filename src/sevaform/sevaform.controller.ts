// src/seva-form/seva-form.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  BadRequestException,
  Session,
} from '@nestjs/common';
import { SevaFormService } from './sevaform.service';
import { CreateSevaFormDto } from './dto/create-sevaform.dto';
import { SessionAuthGuard } from '../auth/auth.guard';

@Controller('seva-forms')
export class SevaFormController {
  constructor(private readonly sevaFormService: SevaFormService) {}

  // Save the seva form details - Any authenticated user can access this route
  @UseGuards(SessionAuthGuard)
  @Post()
  async createSevaForm(
    @Body() createSevaFormDto: CreateSevaFormDto,
    @Session() session: { user?: any },
  ) {
    if (!session.user) {
      throw new BadRequestException('User not authenticated');
    }

    // Optional: Validate that mobile number and confirmation match
    if (
      createSevaFormDto.mobileNumber !==
      createSevaFormDto.mobileNumberConfirmation
    ) {
      throw new BadRequestException(
        'Mobile number and confirmation do not match',
      );
    }

    return this.sevaFormService.createSevaForm(createSevaFormDto);
  }

  // Retrieve a booking by ID - Any authenticated user can access this route
  @UseGuards(SessionAuthGuard)
  @Get(':id')
  async getBookingById(@Param('id') id: number) {
    const booking = this.sevaFormService.getBookingById(id);
    if (!booking) {
      throw new BadRequestException('Booking not found');
    }
    return booking;
  }
}
