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
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { SessionAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  // Create a new contact - Only authenticated users can create contacts
  @Post()
  async createContact(@Body() createContactDto: CreateContactDto) {
    return this.contactsService.createContact(createContactDto);
  }

  // Get all contacts - Only admin users can access this route
  @UseGuards(SessionAuthGuard) // Apply SessionAuthGuard globally for the controller
  @UseGuards(RolesGuard)
  @SetMetadata('role', 'Admin') // Require Admin role for this route
  @Get()
  async getAllContacts() {
    return this.contactsService.getAllContacts();
  }

  // Get a contact by ID - Only admin users can access this route
  @UseGuards(SessionAuthGuard) // Apply SessionAuthGuard globally for the controller
  @UseGuards(RolesGuard)
  @SetMetadata('role', 'Admin') // Require Admin role for this route
  @Get(':id')
  async getContactById(@Param('id') id: number) {
    return this.contactsService.getContactById(id);
  }

  // Update a contact by ID - Only admin users can access this route
  @UseGuards(SessionAuthGuard) // Apply SessionAuthGuard globally for the controller
  @UseGuards(RolesGuard)
  @SetMetadata('role', 'Admin') // Require Admin role for this route
  @Patch(':id')
  async updateContact(
    @Param('id') id: number,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    return this.contactsService.updateContact(id, updateContactDto);
  }

  // Delete a contact by ID - Only admin users can access this route
  @UseGuards(SessionAuthGuard) // Apply SessionAuthGuard globally for the controller
  @UseGuards(RolesGuard)
  @SetMetadata('role', 'Admin') // Require Admin role for this route
  @Delete(':id')
  async deleteContact(@Param('id') id: number) {
    return this.contactsService.deleteContact(id);
  }
}
