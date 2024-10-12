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
import { ParseIdPipe } from '../common/pipes/parse-id.pipe';

@Controller('contacts')
@UseFilters(PrismaExceptionFilter)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  async getContacts() {
    return this.contactsService.getContacts();
  }

  @Get(':id')
  async getContactById(@Param('id', ParseIdPipe) id: number) {
    return this.contactsService.getContactById(id);
  }

  @Post()
  async createContact(@Body() contactData: any) {
    return this.contactsService.createContact(contactData);
  }

  @Patch(':id')
  async updateContact(
    @Param('id', ParseIdPipe) id: number,
    @Body() contactData: any,
  ) {
    return this.contactsService.updateContact(id, contactData);
  }

  @Delete(':id')
  async deleteContact(@Param('id', ParseIdPipe) id: number) {
    return this.contactsService.deleteContact(id);
  }
}
