import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { BaseService } from 'src/common/utils/base.service';

@Injectable()
export class ContactsService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  // Create a new contact
  async createContact(createContactDto: CreateContactDto) {
    return await this.prisma.contacts.create({
      data: createContactDto,
    });
  }

  // Get all contacts
  async getAllContacts() {
    return await this.prisma.contacts.findMany();
  }

  // Get a contact by ID
  async getContactById(contactId: number) {
    // Use BaseService to handle the database operation and throw NotFoundException if needed
    return this.handleDatabaseOperation(
      this.prisma.contacts.findUnique({
        where: { contact_id: contactId },
      }),
      contactId,
      'Contact',
    );
  }

  // Update a contact
  async updateContact(contactId: number, updateContactDto: UpdateContactDto) {
    // Use BaseService to ensure the contact exists before updating
    await this.handleDatabaseOperation(
      this.prisma.contacts.findUnique({
        where: { contact_id: contactId },
      }),
      contactId,
      'Contact',
    );

    return await this.prisma.contacts.update({
      where: { contact_id: contactId },
      data: updateContactDto,
    });
  }

  // Delete a contact
  async deleteContact(contactId: number) {
    // Use BaseService to ensure the contact exists before deleting
    await this.handleDatabaseOperation(
      this.prisma.contacts.findUnique({
        where: { contact_id: contactId },
      }),
      contactId,
      'Contact',
    );

    await this.prisma.contacts.delete({
      where: { contact_id: contactId },
    });

    return { message: 'Contact deleted successfully' };
  }
}
