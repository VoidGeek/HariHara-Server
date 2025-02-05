import { Module } from '@nestjs/common';
import { NewsUpdatesService } from './news-updates.service';
import { NewsUpdatesController } from './newsupdates.controller';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  providers: [NewsUpdatesService, PrismaService, SupabaseService],
  controllers: [NewsUpdatesController],
})
export class NewsupdatesModule {}
