import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { CookieSessionModule } from 'nestjs-cookie-session';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core'; // Import APP_FILTER for global filter

import { AuthModule } from './auth/auth.module';
import { StorageModule } from './supabase/supabase.module';
import { PrismaModule } from './prisma/prisma.module';
import { ContactsModule } from './contacts/contacts.module';
import { ProfileModule } from './profile/profile.module';
import { RolesModule } from './seeds/seeds.module';
import { AdminModule } from './admin/admin.module';
import { getSessionConfig } from './common/config/session.config'; // Import the session config utility
import { NewsupdatesModule } from './newsupdates/newsupdates.module';
import { SevasModule } from './sevas/sevas.module';

import { LoggerMiddleware } from './middleware/logger.middleware'; // Import the logger middleware
import { SimpleHttpExceptionFilter } from './common/filters/SimpleHttpException.filter'; // Import the exception filter

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
    SevasModule,
  ],
  providers: [
    // Apply the global exception filter
    {
      provide: APP_FILTER,
      useClass: SimpleHttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply the logger middleware globally for all routes
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
