import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  // Fetch all contacts
  async getContacts() {
    return this.prisma.contacts.findMany();
  }

  // Get a single contact by ID
  async getContactById(id: number) {
    const contact = await this.prisma.contacts.findUnique({
      where: { contact_id: id },
    });

    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    return contact;
  }

  // Create a new contact
  async createContact(contactData: any) {
    return this.prisma.contacts.create({
      data: contactData,
    });
  }

  // Update a contact
  async updateContact(id: number, contactData: any) {
    return this.prisma.contacts.update({
      where: { contact_id: id },
      data: contactData,
    });
  }

  // Delete a contact
  async deleteContact(id: number) {
    return this.prisma.contacts.delete({
      where: { contact_id: id },
    });
  }
}
