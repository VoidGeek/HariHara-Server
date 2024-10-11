import { Controller, Get, Query, Res } from '@nestjs/common';
import { SupabaseService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get('login')
  async signIn(@Query('provider') provider: string, @Res() res: Response) {
    const { url } = await this.supabaseService.signInWithOAuth(provider as any);
    res.redirect(url); // Redirect to the Supabase OAuth URL
  }

  @Get('callback')
  async oauthCallback(@Query('access_token') accessToken: string) {
    const user = await this.supabaseService.getUser(accessToken);
    return { message: 'Logged in successfully', user };
  }
}
