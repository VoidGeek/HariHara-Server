import { Module } from '@nestjs/common';
import { CookieSessionModule } from 'nestjs-cookie-session';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { StorageModule } from './supabase/supabase.module';
import { PrismaModule } from './prisma/prisma.module';
import { ContactsModule } from './contacts/contacts.module';
import { ProfileModule } from './profile/profile.module';
import { RolesModule } from './seeds/seeds.module';
import { AdminModule } from './admin/admin.module';
import { getSessionConfig } from './utils/session.config'; // Import the session config utility

@Module({
  imports: [
    // Load environment variables via ConfigModule
    ConfigModule.forRoot(),

    // Synchronous Configuration for cookie-session with 1-month expiry
    CookieSessionModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getSessionConfig(configService),
    }),

    // Other modules
    AuthModule,
    StorageModule,
    PrismaModule,
    ContactsModule,
    ProfileModule,
    RolesModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
