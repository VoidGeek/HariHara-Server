import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  // Register with Email/Password
  async register(
    email: string,
    password: string,
    name: string,
    phone: string,
    session: { user?: any },
  ) {
    const hashedPassword = await argon2.hash(password);

    const newUser = await this.prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        auth_provider: 'traditional',
        role_id: 1, // Assign default role
      },
    });

    // Store user data in session
    session.user = {
      id: newUser.user_id,
      email: newUser.email,
      name: newUser.name,
    };

    return { message: 'Registration successful', user: newUser };
  }

  // Login with Email/Password and store user in session
  async login(email: string, password: string, session: { user?: any }) {
    const user = await this.prisma.users.findUnique({ where: { email } });
    if (!user || user.auth_provider !== 'traditional') {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Store user data in session
    session.user = {
      id: user.user_id,
      email: user.email,
      name: user.name,
    };

    return { message: 'Logged in successfully' };
  }

  // OAuth login and store user in session
  async oauthLogin(email: string, session: { user?: any }) {
    const user = await this.prisma.users.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Store user data in session
    session.user = {
      id: user.user_id,
      email: user.email,
      name: user.name,
    };

    return { message: 'Logged in with OAuth successfully' };
  }
}
