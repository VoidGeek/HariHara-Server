import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSevaDto } from './dto/create-seva.dto';
import { UpdateSevaDto } from './dto/update-seva.dto';
import { BaseService } from 'src/common/utils/base.service';

@Injectable()
export class SevasService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  // Create a new Seva
  async createSeva(createSevaDto: CreateSevaDto) {
    return await this.prisma.sevas.create({
      data: {
        ...createSevaDto,
      },
    });
  }

  // Get all Sevas
  async getAllSevas() {
    return await this.prisma.sevas.findMany();
  }

  // Get a Seva by ID
  async getSevaById(sevaId: number) {
    // Use BaseService to handle the database operation and throw NotFoundException if needed
    return this.handleDatabaseOperation(
      this.prisma.sevas.findUnique({
        where: { seva_id: sevaId },
      }),
      sevaId,
      'Seva',
    );
  }

  // Update a Seva
  async updateSeva(sevaId: number, updateSevaDto: UpdateSevaDto) {
    // Ensure the seva exists before updating
    await this.handleDatabaseOperation(
      this.prisma.sevas.findUnique({
        where: { seva_id: sevaId },
      }),
      sevaId,
      'Seva',
    );

    return await this.prisma.sevas.update({
      where: { seva_id: sevaId },
      data: {
        ...updateSevaDto,
      },
    });
  }

  // Delete a Seva
  async deleteSeva(sevaId: number) {
    // Ensure the seva exists before deleting
    await this.handleDatabaseOperation(
      this.prisma.sevas.findUnique({
        where: { seva_id: sevaId },
      }),
      sevaId,
      'Seva',
    );

    await this.prisma.sevas.delete({
      where: { seva_id: sevaId },
    });

    return { message: 'Seva deleted successfully' };
  }

  async deleteAllSevas() {
    await this.prisma.sevas.deleteMany(); // Deletes all records in the sevas table
    return { message: 'All Sevas deleted successfully' };
  }
}
