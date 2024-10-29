import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNewsUpdateDto } from './dto/create-newsupdate.dto';
import { UpdateNewsUpdateDto } from './dto/update-newsupdate.dto';
import { BaseService } from 'src/common/utils/base.service';

@Injectable()
export class NewsUpdatesService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  // Create a new news update
  async createNewsUpdate(
    createNewsUpdateDto: CreateNewsUpdateDto,
    created_by: number,
  ) {
    return await this.prisma.newsUpdates.create({
      data: {
        ...createNewsUpdateDto,
        created_by, // Associate the news update with the userId
      },
    });
  }

  // Get all news updates
  async getAllNewsUpdates() {
    return await this.prisma.newsUpdates.findMany();
  }

  // Get a news update by ID
  async getNewsUpdateById(newsId: number) {
    // Use BaseService to handle the database operation and throw NotFoundException if needed
    return this.handleDatabaseOperation(
      this.prisma.newsUpdates.findUnique({
        where: { news_id: newsId },
      }),
      newsId,
      'News Update',
    );
  }

  // Update a news update
  async updateNewsUpdate(
    newsId: number,
    updateNewsUpdateDto: UpdateNewsUpdateDto,
    created_by: number,
  ) {
    // Ensure the news update exists before updating
    await this.handleDatabaseOperation(
      this.prisma.newsUpdates.findUnique({
        where: { news_id: newsId },
      }),
      newsId,
      'News Update',
    );

    return await this.prisma.newsUpdates.update({
      where: { news_id: newsId },
      data: {
        ...updateNewsUpdateDto,
        created_by, // Optionally update the associated userId
      },
    });
  }

  // Delete a news update
  async deleteNewsUpdate(newsId: number) {
    // Use BaseService to ensure the news update exists before deleting
    await this.handleDatabaseOperation(
      this.prisma.newsUpdates.findUnique({
        where: { news_id: newsId },
      }),
      newsId,
      'News Update',
    );

    await this.prisma.newsUpdates.delete({
      where: { news_id: newsId },
    });

    return { message: 'News update deleted successfully' };
  }
}
