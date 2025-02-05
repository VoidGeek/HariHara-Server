import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service'; // Import SupabaseService
import { GalleryService } from './gallery.service';
import { GalleryController } from './gallery.controller';

@Module({
  providers: [GalleryService, PrismaService, SupabaseService], // Add SupabaseService as a provider
  controllers: [GalleryController],
})
export class GalleryModule {}
