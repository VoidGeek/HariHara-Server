import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async getContacts() {
    return this.prisma.contacts.findMany();
  }

  async getContactById(id: number) {
    const contact = await this.prisma.contacts.findUnique({
      where: { contact_id: id },
    });

    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    return contact;
  }

  async createContact(contactData: any) {
    return this.prisma.contacts.create({
      data: contactData,
    });
  }

  async updateContact(id: number, contactData: any) {
    return this.prisma.contacts.update({
      where: { contact_id: id },
      data: contactData,
    });
  }

  async deleteContact(id: number) {
    return this.prisma.contacts.delete({
      where: { contact_id: id },
    });
  }
}
