import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { SessionAuthGuard } from 'src/auth/auth.guard'; // Import the session guard
import { RolesGuard } from 'src/auth/roles.guard'; // Import the roles guard
import { Roles } from 'src/common/decorators/roles.decorator'; // Import the roles decorator

@UseGuards(SessionAuthGuard, RolesGuard) // Apply both session and roles guard
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  // Create a new contact - No guard applied here
  @Post()
  async createContact(@Body() createContactDto: CreateContactDto) {
    return this.contactsService.createContact(createContactDto);
  }

  // Get all contacts (Admin only)
  @Get()
  @Roles('Admin') // Only admin can access
  async getAllContacts() {
    return this.contactsService.getAllContacts();
  }

  // Get a contact by ID (Admin only)
  @Get(':id')
  @Roles('Admin') // Only admin can access
  async getContactById(@Param('id') id: number) {
    return this.contactsService.getContactById(id);
  }

  // Update a contact by ID (Admin only)
  @Patch(':id')
  @Roles('Admin') // Only admin can access
  async updateContact(
    @Param('id') id: number,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    return this.contactsService.updateContact(id, updateContactDto);
  }

  // Delete a contact by ID (Admin only)
  @Delete(':id')
  @Roles('Admin') // Only admin can access
  async deleteContact(@Param('id') id: number) {
    return this.contactsService.deleteContact(id);
  }
}
