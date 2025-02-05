import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { NewsUpdatesService } from './news-updates.service';
import { CreateNewsUpdateDto } from './dto/create-news-update.dto';
import { UpdateNewsUpdateDto } from './dto/update-news-update.dto';

@Controller('news-updates')
export class NewsUpdatesController {
  constructor(private newsUpdatesService: NewsUpdatesService) {}

  // Create a news update
  @Post()
  async createNewsUpdate(
    @Body() createNewsUpdateDto: CreateNewsUpdateDto,
    @Req() req: any,
  ) {
    const userId = req.session?.user?.id; // Extract user ID from session
    if (!userId) {
      throw new BadRequestException('User not authenticated.');
    }

    return this.newsUpdatesService.createNewsUpdate({
      ...createNewsUpdateDto,
      created_by: userId,
    });
  }

  // Update a news update
  @Put('update/:id')
  async updateNewsUpdate(
    @Param('id') newsId: number,
    @Body() updateNewsUpdateDto: UpdateNewsUpdateDto,
    @Req() req: any,
  ) {
    const userId = req.session?.user?.id; // Extract user ID from session
    if (!userId) {
      throw new BadRequestException('User not authenticated.');
    }

    return this.newsUpdatesService.updateNewsUpdate(newsId, {
      ...updateNewsUpdateDto,
      updated_by: userId,
    });
  }

  // Delete a news update
  @Delete(':id')
  async deleteNewsUpdate(@Param('id') newsId: number) {
    return this.newsUpdatesService.deleteNewsUpdate(newsId);
  }

  // Get a single news update by ID
  @Get(':id')
  async getNewsUpdateById(@Param('id') newsId: number) {
    return this.newsUpdatesService.getNewsUpdateById(newsId);
  }

  // Get all news updates
  @Get()
  async getAllNewsUpdates() {
    return this.newsUpdatesService.getAllNewsUpdates();
  }
}
