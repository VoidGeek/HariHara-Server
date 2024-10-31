// src/seva-form/seva-form.controller.ts
import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Query,
  Param,
  UseGuards,
  SetMetadata,
  BadRequestException,
  Session,
} from '@nestjs/common';
import { SevaFormService } from './sevaform.service';
import { CreateSevaFormDto } from './dto/create-sevaform.dto';
import { SessionAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('sevaforms')
export class SevaFormController {
  constructor(private readonly sevaFormService: SevaFormService) {}

  // Save the seva form details
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

    const result = await this.sevaFormService.createSevaForm(createSevaFormDto);
    return result;
  }

  // Get all Seva forms or filter by fields
  @UseGuards(SessionAuthGuard)
  @UseGuards(RolesGuard)
  @SetMetadata('role', 'Admin')
  @Get()
  async getSevaForms(
    @Query()
    query: { id?: number; name?: string; phoneNumber?: string; date?: string },
    @Session() session: { user?: any },
  ) {
    // Check if the user has admin privileges
    if (!session.user || !session.user.isAdmin) {
      throw new BadRequestException('User not authorized');
    }

    return this.sevaFormService.getSevaForms(query); // Pass the query object to the service
  }

  // Retrieve a booking by ID
  @UseGuards(SessionAuthGuard)
  @UseGuards(RolesGuard)
  @SetMetadata('role', 'Admin')
  @Get(':id')
  async getBookingById(
    @Param('id') id: number,
    @Session() session: { user?: any },
  ) {
    if (!session.user || !session.user.isAdmin) {
      throw new BadRequestException('User not authorized');
    }

    return this.sevaFormService.getBookingById(id);
  }

  // Delete all Seva forms - Admin access only
  @UseGuards(SessionAuthGuard)
  @UseGuards(RolesGuard)
  @SetMetadata('role', 'Admin')
  @Delete()
  async deleteAllSevaForms(@Session() session: { user?: any }) {
    if (!session.user || !session.user.isAdmin) {
      throw new BadRequestException('User not authorized');
    }

    return this.sevaFormService.deleteAllSevaForms();
  }

  // Delete a specific Seva form by ID - Admin access only
  @UseGuards(SessionAuthGuard)
  @UseGuards(RolesGuard)
  @SetMetadata('role', 'Admin')
  @Delete(':id')
  async deleteSevaFormById(
    @Param('id') id: number,
    @Session() session: { user?: any },
  ) {
    if (!session.user || !session.user.isAdmin) {
      throw new BadRequestException('User not authorized');
    }

    return this.sevaFormService.deleteSevaFormById(id);
  }
}
