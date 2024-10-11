import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SupabaseService } from './auth.service';

@Module({
  providers: [SupabaseService],
  controllers: [AuthController],
})
export class AuthModule {}
