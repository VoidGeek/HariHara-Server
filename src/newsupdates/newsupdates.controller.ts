import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
  UseGuards,
  SetMetadata,
  Session,
  BadRequestException,
} from '@nestjs/common';
import { NewsUpdatesService } from './newsupdates.service';
import { CreateNewsUpdateDto } from './dto/create-newsupdate.dto';
import { UpdateNewsUpdateDto } from './dto/update-newsupdate.dto';
import { SessionAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@UseGuards(SessionAuthGuard) // Apply SessionAuthGuard globally for the controller
@Controller('news-updates')
export class NewsUpdatesController {
  constructor(private readonly newsUpdatesService: NewsUpdatesService) {}

  // Create a new news update - Only admin users can create news updates
  @UseGuards(RolesGuard)
  @SetMetadata('role', 'Admin') // Require Admin role for this route
  @Post()
  async createNewsUpdate(
    @Body() createNewsUpdateDto: CreateNewsUpdateDto,
    @Session() session: { user?: any },
  ) {
    if (!session.user) {
      throw new BadRequestException('User not authenticated');
    }

    const userId = session.user.id; // Extract userId from the session
    return this.newsUpdatesService.createNewsUpdate(createNewsUpdateDto, userId);
  }

  // Get all news updates - Any authenticated user can access this route
  @Get()
  async getAllNewsUpdates() {
    return this.newsUpdatesService.getAllNewsUpdates();
  }

  // Get a news update by ID - Any authenticated user can access this route
  @Get(':id')
  async getNewsUpdateById(@Param('id') id: number) {
    return this.newsUpdatesService.getNewsUpdateById(id);
  }

  // Update a news update by ID - Only admin users can access this route
  @UseGuards(RolesGuard)
  @SetMetadata('role', 'Admin') // Require Admin role for this route
  @Patch(':id')
  async updateNewsUpdate(
    @Param('id') id: number,
    @Body() updateNewsUpdateDto: UpdateNewsUpdateDto,
    @Session() session: { user?: any },
  ) {
    if (!session.user) {
      throw new BadRequestException('User not authenticated');
    }

    const userId = session.user.id; // Extract userId from the session
    return this.newsUpdatesService.updateNewsUpdate(id, updateNewsUpdateDto, userId);
  }

  // Delete a news update by ID - Only admin users can access this route
  @UseGuards(RolesGuard)
  @SetMetadata('role', 'Admin') // Require Admin role for this route
  @Delete(':id')
  async deleteNewsUpdate(@Param('id') id: number) {
    return this.newsUpdatesService.deleteNewsUpdate(id);
  }
}
