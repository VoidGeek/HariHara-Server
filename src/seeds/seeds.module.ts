import { Module } from '@nestjs/common';
import { RolesSeedService } from './roles.seed.service'; // Import RolesSeedService

@Module({
  providers: [RolesSeedService], // Only provide RolesSeedService
  exports: [RolesSeedService], // Export the seed service for use in other modules
})
export class RolesModule {}
