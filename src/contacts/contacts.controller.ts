import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseFilters,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { PrismaExceptionFilter } from '../common/filters/prisma-exception.filter';

@Controller('contacts')
@UseFilters(PrismaExceptionFilter)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  async getContacts() {
    return this.contactsService.getContacts();
  }

  @Get(':id')
  async getContactById(@Param('id') id: number) {
    return this.contactsService.getContactById(id);
  }

  @Post()
  async createContact(@Body() contactData: any) {
    return this.contactsService.createContact(contactData);
  }

  @Patch(':id')
  async updateContact(@Param('id') id: number, @Body() contactData: any) {
    return this.contactsService.updateContact(id, contactData);
  }

  @Delete(':id')
  async deleteContact(@Param('id') id: number) {
    return this.contactsService.deleteContact(id);
  }
}
