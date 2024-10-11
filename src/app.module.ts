import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { SupabaseService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [AuthModule, StorageModule],
  controllers: [AppController, AuthController],
  providers: [AppService, SupabaseService],
})
export class AppModule {}
