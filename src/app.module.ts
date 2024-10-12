import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { StorageModule } from './storage/storage.module';
import { PrismaModule } from './prisma/prisma.module';
import { ContactsModule } from './contacts/contacts.module';

@Module({
  imports: [AuthModule, StorageModule, PrismaModule, ContactsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
