import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesSeedService implements OnModuleInit {
  private readonly logger = new Logger(RolesSeedService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedRoles();
  }

  // Optimized method to seed default roles
  private async seedRoles() {
    const requiredRoles = ['User', 'Admin', 'Moderator']; // List of required roles

    // Fetch existing roles from the database
    const existingRoles = await this.prisma.roles.findMany({
      where: { role_name: { in: requiredRoles } },
    });
    const existingRoleNames = existingRoles.map((role) => role.role_name);

    // Find the roles that are missing
    const rolesToSeed = requiredRoles.filter(
      (role) => !existingRoleNames.includes(role),
    );

    // If there are any missing roles, seed them
    if (rolesToSeed.length > 0) {
      await this.prisma.roles.createMany({
        data: rolesToSeed.map((role_name) => ({ role_name })),
      });

      this.logger.log(`Roles added successfully: ${rolesToSeed.join(', ')}`);
    } else {
      this.logger.log('Roles table is already fully populated.');
    }
  }
}
