// src/seva-form/seva-form.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSevaFormDto } from './dto/create-sevaform.dto';
import { BaseService } from 'src/common/utils/base.service';

@Injectable()
export class SevaFormService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  // Create a new Seva form entry
  async createSevaForm(createSevaFormDto: CreateSevaFormDto) {
    // Validate if the corresponding Seva exists
    const seva = await this.prisma.sevas.findUnique({
      where: { seva_id: createSevaFormDto.sevaId },
    });

    if (!seva) {
      throw new NotFoundException(
        `Seva with ID ${createSevaFormDto.sevaId} not found`,
      );
    }

    return await this.prisma.sevaForm.create({
      data: {
        ...createSevaFormDto,
        // Optionally add other fields if necessary
      },
    });
  }

  // Retrieve a booking by ID
  async getBookingById(id: number) {
    const booking = await this.prisma.sevaForm.findUnique({
      where: { id }, // Assuming the primary key in sevaForm is 'id'
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }
}
