import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaExceptionFilter } from 'src/common/filters/prisma-exception.filter';

@Module({
  controllers: [ContactsController],
  providers: [ContactsService, PrismaService, PrismaExceptionFilter],
})
export class ContactsModule {}
