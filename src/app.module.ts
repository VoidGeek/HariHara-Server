import { Module } from '@nestjs/common';
import {
  CookieSessionModule,
  NestCookieSessionOptions,
} from 'nestjs-cookie-session';
import { ConfigModule, ConfigService } from '@nestjs/config'; // For async config

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { StorageModule } from './storage/storage.module';
import { PrismaModule } from './prisma/prisma.module';
import { ContactsModule } from './contacts/contacts.module';
import { ProfileModule } from './profile/profile.module';
import { RolesModule } from './roles/roles.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    // Synchronous Configuration for cookie-session
    CookieSessionModule.forRoot({
      session: { secret: process.env.SESSION_SECRET || 'your-session-secret' },
    }),

    // Async Configuration for cookie-session using ConfigModule
    CookieSessionModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<NestCookieSessionOptions> => {
        return {
          session: {
            secret:
              configService.get('SESSION_SECRET') || 'your-session-secret',
            maxAge: 24 * 60 * 60 * 1000, // Set session expiration to 24 hours
          },
        };
      },
    }),

    // Additional Modules
    ConfigModule.forRoot(), // Load environment variables if needed
    AuthModule, // Your existing modules
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
