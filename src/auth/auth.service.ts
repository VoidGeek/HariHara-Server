import {
  Injectable,
  OnModuleInit,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabase;
  private readonly logger = new Logger(SupabaseService.name);

  constructor(private readonly prisma: PrismaService) {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
    );
  }

  async onModuleInit() {
    await this.seedRoles();
  }

  private async seedRoles() {
    const rolesCount = await this.prisma.roles.count();

    if (rolesCount === 0) {
      await this.prisma.roles.createMany({
        data: [
          { role_name: 'User' }, // Default user role
          { role_name: 'Admin' }, // Default admin role
        ],
      });

      this.logger.log('Default roles added successfully: User, Admin');
    } else {
      this.logger.log('Roles table is already populated.');
    }
  }

  // Store sessions for token invalidation (in production, use a persistent store)
  private sessionStore: Map<string, boolean> = new Map();

  // Authenticate the user with OAuth (Google, GitHub, Facebook)
  async signInWithOAuth(provider: 'google' | 'github' | 'facebook') {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider,
    });
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  // Get user details using the access token
  async getUser(accessToken: string) {
    const { data, error } = await this.supabase.auth.getUser(accessToken);

    if (error) {
      throw new BadRequestException(`Error fetching user: ${error.message}`);
    }

    if (!data || !data.user) {
      throw new BadRequestException('Auth session missing!');
    }

    return data.user;
  }

  // Store user information in the database
  async storeUserInDatabase(user: any, isOAuth: boolean = true) {
    const profileImageId = user.avatar_url
      ? parseInt(user.avatar_url, 10)
      : null;
    const phone = user.phone || '';

    // Check if the user already exists
    const existingUser = await this.prisma.users.findUnique({
      where: { email: user.email },
    });

    if (existingUser) {
      return existingUser; // Return existing user if found
    }

    // Fetch the default role ID (for "User")
    const userRole = await this.prisma.roles.findFirst({
      where: { role_name: 'User' },
    });

    if (!userRole) {
      throw new Error('Default role "User" not found');
    }

    // Create new user, skipping password for OAuth users
    const newUser = await this.prisma.users.create({
      data: {
        name: user.user_metadata.full_name || user.email,
        email: user.email,
        phone: phone,
        password: isOAuth ? null : await this.hashPassword('default_password'),
        auth_provider: isOAuth ? 'oauth' : 'traditional',
        Role: {
          connect: { role_id: userRole.role_id },
        },
        Image: profileImageId
          ? {
              connect: { image_id: profileImageId },
            }
          : undefined,
      },
    });

    return newUser;
  }

  // Hash a password using argon2
  private async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  // Logout and invalidate the session
  async logout(accessToken: string) {
    const { error } = await this.supabase.auth.signOut(); // Invalidate Supabase session

    if (error) {
      throw new Error(`Error logging out: ${error.message}`);
    }

    // Invalidate the session by marking the token as invalid
    this.sessionStore.set(accessToken, false);
    return { message: 'Logged out successfully' };
  }

  // Check if the session is valid
  async isSessionValid(accessToken: string) {
    return this.sessionStore.get(accessToken) !== false; // Check if the session is invalid
  }
}
