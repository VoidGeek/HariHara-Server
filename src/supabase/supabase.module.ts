import { Module } from '@nestjs/common';
import { ImageController } from './Image.controller';
import { SupabaseService } from './supabase.service';

@Module({
  providers: [SupabaseService],
  controllers: [ImageController],
})
export class StorageModule {}
