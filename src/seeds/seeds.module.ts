import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RolesSeedService } from './roles.seed.service'; // Import RolesSeedService

@Module({
  providers: [PrismaService, RolesSeedService], // Register services
  exports: [RolesSeedService], // Export the seed service for use in other modules
})
export class RolesModule {}
