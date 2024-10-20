import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // This makes PrismaModule globally available across the entire app
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Export PrismaService globally
})
export class PrismaModule {}
