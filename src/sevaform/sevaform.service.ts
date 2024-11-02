// src/seva-form/seva-form.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
    const parsedDate = new Date(createSevaFormDto.date);

    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException(
        'Invalid date format. Please use ISO format.',
      );
    }

    const seva = await this.prisma.sevas.findUnique({
      where: { seva_id: createSevaFormDto.sevaId },
    });

    if (!seva) {
      throw new NotFoundException(
        `Seva with ID ${createSevaFormDto.sevaId} not found`,
      );
    }

    const createdSevaForm = await this.prisma.sevaForm.create({
      data: {
        ...createSevaFormDto,
        date: parsedDate,
      },
    });

    return { id: createdSevaForm.id };
  }

  // Retrieve all Seva forms, including Seva name
  async getAllSevaForms() {
    return this.prisma.sevaForm.findMany({
      include: {
        seva: {
          select: {
            name: true, // Fetch only the 'name' field of the related 'Seva'
          },
        },
      },
    });
  }

  // Retrieve Seva forms by parameters
  async getSevaFormsByParams(filter: any) {
    return this.prisma.sevaForm.findMany({
      where: {
        OR: [
          { id: filter.id }, // Assuming id is a number
          { name: { contains: filter.name } }, // Assuming name is a string
          { mobileNumber: filter.phoneNumber }, // Assuming phoneNumber is a string
          { date: filter.date ? new Date(filter.date) : undefined }, // Assuming date is a Date
        ],
      },
      include: {
        seva: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  // Delete all Seva forms
  async deleteAllSevaForms() {
    return this.prisma.sevaForm.deleteMany();
  }

  // Delete a specific Seva form by ID
  async deleteSevaFormById(id: number) {
    const booking = await this.prisma.sevaForm.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException(`Seva Form with ID ${id} not found`);
    }

    return this.prisma.sevaForm.delete({
      where: { id },
    });
  }
}
