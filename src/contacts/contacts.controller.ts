import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseFilters,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { PrismaExceptionFilter } from '../common/filters/prisma-exception.filter'; // Adjust the path if needed

@Controller('contacts')
@UseFilters(PrismaExceptionFilter) // Use filter locally for this controller
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  async getAllContacts() {
    return this.contactsService.getContacts();
  }

  @Get(':id')
  async getContactById(@Param('id') id: string) {
    return this.contactsService.getContactById(Number(id)); // Convert 'id' to number
  }

  @Post()
  async createContact(@Body() contactData: any) {
    return this.contactsService.createContact(contactData);
  }

  @Put(':id')
  async updateContact(@Param('id') id: number, @Body() contactData: any) {
    return this.contactsService.updateContact(id, contactData);
  }

  @Delete(':id')
  async deleteContact(@Param('id') id: number) {
    return this.contactsService.deleteContact(id);
  }
}
