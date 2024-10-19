import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  // Register a new user
  async register(email: string, password: string, name: string, phone: string) {
    const hashedPassword = await argon2.hash(password);

    const newUser = await this.prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        auth_provider: 'traditional',
        role_id: 1, // Default user role
      },
    });

    return newUser;
  }

  // Login user by validating the password
  async login(email: string, password: string) {
    const user = await this.prisma.users.findUnique({ where: { email } });
    if (!user || user.auth_provider !== 'traditional') {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user; // Return the authenticated user
  }

  // Handle OAuth login (example for future use)
  async oauthLogin(email: string) {
    const user = await this.prisma.users.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
