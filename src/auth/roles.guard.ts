import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service'; // PrismaService for DB queries

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Fetch the required role name from metadata
    const requiredRole = this.reflector.get<string>(
      'role',
      context.getHandler(),
    );
    if (!requiredRole) {
      return true; // No role required, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request.session?.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Fetch user role from the database (join Users and Roles table)
    const userWithRole = await this.prisma.users.findUnique({
      where: { user_id: user.id },
      include: {
        Role: true, // Include related role information
      },
    });

    if (!userWithRole || userWithRole.Role.role_name !== requiredRole) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true; // User has the required role, allow access
  }
}
