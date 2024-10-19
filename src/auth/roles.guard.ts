import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';
import { getSessionUser } from 'src/common/utils/session.util';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRole = this.reflector.get<string>(
      'role',
      context.getHandler(),
    );
    if (!requiredRole) return true; // If no role required, allow access

    const request = context.switchToHttp().getRequest();
    const user = getSessionUser(request); // Get the session user

    // Fetch the user's role from the database
    const userWithRole = await this.prisma.users.findUnique({
      where: { user_id: user.id },
      include: { Role: true },
    });

    if (!userWithRole || userWithRole.Role.role_name !== requiredRole) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true; // User has the required role
  }
}
