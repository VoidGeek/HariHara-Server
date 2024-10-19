import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  // Create a new contact
  @Post()
  async createContact(@Body() createContactDto: CreateContactDto) {
    console.log('DTO Validated:', createContactDto);
    return this.contactsService.createContact(createContactDto);
  }

  // Get all contacts
  @Get()
  async getAllContacts() {
    return this.contactsService.getAllContacts();
  }

  // Get a contact by ID
  @Get(':id')
  async getContactById(@Param('id') id: number) {
    return this.contactsService.getContactById(id);
  }

  // Update a contact by ID
  @Patch(':id')
  async updateContact(
    @Param('id') id: number,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    return this.contactsService.updateContact(id, updateContactDto);
  }

  // Delete a contact by ID
  @Delete(':id')
  async deleteContact(@Param('id') id: number) {
    return this.contactsService.deleteContact(id);
  }
}
