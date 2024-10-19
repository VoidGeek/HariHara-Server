import { Module } from '@nestjs/common';
import { CookieSessionModule } from 'nestjs-cookie-session';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from 'src/auth/auth.module';
import { StorageModule } from 'src/supabase/supabase.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ContactsModule } from 'src/contacts/contacts.module';
import { ProfileModule } from 'src/profile/profile.module';
import { RolesModule } from 'src/seeds/seeds.module';
import { AdminModule } from 'src/admin/admin.module';
import { getSessionConfig } from 'src/utils/session.config'; // Import the session config utility
import { NewsupdatesModule } from 'src/newsupdates/newsupdates.module';

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
    NewsupdatesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
