// src/seva-form/seva-form.controller.ts
import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Query,
  UseGuards,
  SetMetadata,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { SevaFormService } from './sevaform.service';
import { CreateSevaFormDto } from './dto/create-sevaform.dto';
import { SessionAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('sevaforms')
export class SevaFormController {
  constructor(private readonly sevaFormService: SevaFormService) {}

  // Save the seva form details
  @Post()
  async createSevaForm(@Body() createSevaFormDto: CreateSevaFormDto) {
    // Validate that mobile number and confirmation match
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

  // Get all Seva forms (Admin access only)
  @UseGuards(SessionAuthGuard, RolesGuard)
  @SetMetadata('role', 'Admin')
  @Get()
  async getAllSevaForms() {
    return this.sevaFormService.getAllSevaForms(); // Call the service to get all Seva forms
  }

  // Get Seva forms by parameters (Admin access only)
  @UseGuards(SessionAuthGuard, RolesGuard)
  @SetMetadata('role', 'Admin')
  @Get('filter')
  async getSevaFormsByParams(
    @Query()
    query: {
      id?: number;
      name?: string;
      phoneNumber?: string;
      date?: string;
    },
  ) {
    return this.sevaFormService.getSevaFormsByParams(query); // Call the service to get filtered Seva forms
  }

  // Delete all Seva forms (Admin access only)
  @UseGuards(SessionAuthGuard, RolesGuard)
  @SetMetadata('role', 'Admin')
  @Delete()
  async deleteAllSevaForms() {
    return this.sevaFormService.deleteAllSevaForms();
  }

  // Delete a specific Seva form by ID (Admin access only)
  @UseGuards(SessionAuthGuard, RolesGuard)
  @SetMetadata('role', 'Admin')
  @Delete(':id')
  async deleteSevaFormById(@Param('id') id: number) {
    return this.sevaFormService.deleteSevaFormById(id);
  }
}
