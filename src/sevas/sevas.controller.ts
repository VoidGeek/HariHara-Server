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
import { SevasService } from './sevas.service';
import { CreateSevaDto } from './dto/create-seva.dto';
import { UpdateSevaDto } from './dto/update-seva.dto';
import { SessionAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';

// Apply SessionAuthGuard globally for the controller
@Controller('sevas')
export class SevasController {
  constructor(private readonly sevasService: SevasService) {}

  // Create a new Seva - Only admin users can create Sevas
  @UseGuards(SessionAuthGuard)
  @UseGuards(RolesGuard)
  @SetMetadata('role', 'Admin') // Require Admin role for this route
  @Post()
  async createSeva(
    @Body() createSevaDto: CreateSevaDto,
    @Session() session: { user?: any },
  ) {
    if (!session.user) {
      throw new BadRequestException('User not authenticated');
    }

    return this.sevasService.createSeva(createSevaDto);
  }

  // Get all Sevas - Any authenticated user can access this route
  @Get()
  async getAllSevas() {
    return this.sevasService.getAllSevas();
  }

  // Get a Seva by ID - Any authenticated user can access this route
  @Get(':id')
  async getSevaById(@Param('id') id: number) {
    return this.sevasService.getSevaById(id);
  }

  // Update a Seva by ID - Only admin users can access this route
  @UseGuards(SessionAuthGuard)
  @UseGuards(RolesGuard)
  @SetMetadata('role', 'Admin') // Require Admin role for this route
  @Patch(':id')
  async updateSeva(
    @Param('id') id: number,
    @Body() updateSevaDto: UpdateSevaDto,
    @Session() session: { user?: any },
  ) {
    if (!session.user) {
      throw new BadRequestException('User not authenticated');
    }

    return this.sevasService.updateSeva(id, updateSevaDto);
  }

  // Delete a Seva by ID - Only admin users can access this route
  @UseGuards(SessionAuthGuard)
  @UseGuards(RolesGuard)
  @SetMetadata('role', 'Admin') // Require Admin role for this route
  @Delete(':id')
  async deleteSeva(@Param('id') id: number) {
    return this.sevasService.deleteSeva(id);
  }

  @UseGuards(SessionAuthGuard)
  @UseGuards(RolesGuard)
  @SetMetadata('role', 'Admin') // Require Admin role for this route
  @Delete()
  async deleteAllSevas() {
    return this.sevasService.deleteAllSevas();
  }
}
