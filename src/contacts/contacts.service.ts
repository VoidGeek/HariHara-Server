import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from 'utils/base.service';

@Injectable()
export class ContactsService extends BaseService {
  constructor(private prisma: PrismaService) {
    super();
  }

  // Fetch all contacts and order by contact_id (no need for handleDatabaseOperation here)
  async getContacts(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [contacts, total] = await this.prisma.$transaction([
      this.prisma.contacts.findMany({
        skip: skip,
        take: limit,
        orderBy: {
          contact_id: 'asc',
        },
      }),
      this.prisma.contacts.count(), // Get total number of contacts
    ]);

    return {
      data: contacts,
      meta: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  // Fetch a single contact by ID
  async getContactById(id: number) {
    return this.handleDatabaseOperation(
      this.prisma.contacts.findUnique({
        where: { contact_id: id },
      }),
      id,
      'Contact',
    );
  }

  // Create a new contact (handleDatabaseOperation is not needed for create)
  async createContact(contactData: any) {
    return this.prisma.contacts.create({
      data: contactData,
    });
  }

  // Update an existing contact by ID
  async updateContact(id: number, contactData: any) {
    return this.handleDatabaseOperation(
      this.prisma.contacts.update({
        where: { contact_id: id },
        data: contactData,
      }),
      id,
      'Contact',
    );
  }

  // Delete a contact by ID
  async deleteContact(id: number) {
    return this.handleDatabaseOperation(
      this.prisma.contacts.delete({
        where: { contact_id: id },
      }),
      id,
      'Contact',
    );
  }
}
