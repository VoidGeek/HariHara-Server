import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
    );
  }

  async signInWithOAuth(provider: 'google' | 'github' | 'facebook') {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async getUser(accessToken: string) {
    const { data, error } = await this.supabase.auth.getUser(accessToken);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}
