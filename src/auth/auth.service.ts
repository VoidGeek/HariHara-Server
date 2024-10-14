import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { PrismaService } from '../prisma/prisma.service'; // Assuming you're using Prisma
import { Prisma } from '@prisma/client';

@Injectable()
export class SupabaseService {
  private supabase;

  constructor(private readonly prisma: PrismaService) {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
    );
  }

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
    console.log('Decoded Access Token:', accessToken); // Log the decoded access token

    const { data, error } = await this.supabase.auth.getUser(accessToken);

    if (error) {
      console.error('Error fetching user from Supabase:', error); // Log the error
      throw new Error(`Error fetching user: ${error.message}`);
    }

    if (!data || !data.user) {
      console.error('No user data found:', data); // Log missing session data
      throw new Error('Auth session missing!');
    }

    return data.user;
  }

  // Store user information in the database
  // Store user information in the database
  async storeUserInDatabase(user: any) {
    const profileImageId = user.avatar_url
      ? parseInt(user.avatar_url, 10)
      : null;

    // Ensure phone is provided, or set a default value if necessary
    const phone = user.phone || ''; // Use empty string or null if phone is optional

    const existingUser = await this.prisma.users.findUnique({
      where: { email: user.email },
    });

    if (existingUser) {
      return existingUser; // Return existing user if found
    }

    // Create a new user in the database
    const newUser = await this.prisma.users.create({
      data: {
        name: user.user_metadata.full_name || user.email,
        email: user.email,
        phone: phone, // Ensure the phone is provided here
        Image: {
          connect: { image_id: profileImageId }, // Connect existing image by ID
        },
      } as Prisma.UsersCreateInput,
    });

    return newUser;
  }
}
