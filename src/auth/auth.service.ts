import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { BaseService } from 'src/common/utils/base.service'; // Import BaseService

@Injectable()
export class AuthService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  // Register a new user
  async register(
    email: string,
    password: string,
    name: string,
    phone: string,
    role_id?: number, // Add role_id as an optional parameter
  ) {
    const hashedPassword = await argon2.hash(password);

    const newUser = await this.prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        auth_provider: 'traditional',
        role_id: role_id || 1, // Use provided role_id if present, otherwise default to 1
      },
    });

    return newUser;
  }

  // Login user by validating the password
  async login(email: string, password: string) {
    const user = await this.prisma.users.findUnique({ where: { email } });
    if (!user || user.auth_provider !== 'traditional') {
      this.throwUnauthorizedException('UNAUTHORIZED'); // Dynamically fetch from Map
    }

    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) {
      this.throwUnauthorizedException('UNAUTHORIZED'); // Dynamically fetch from Map
    }

    return user; // Return the authenticated user
  }

  // Handle OAuth login (example for future use)
  async oauthLogin(email: string) {
    const user = await this.prisma.users.findUnique({ where: { email } });
    if (!user) {
      this.throwUnauthorizedException('USER_NOT_FOUND'); // Uses 'User not found'
    }

    return user;
  }
}
