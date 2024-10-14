import {
  Controller,
  Get,
  Query,
  Res,
  BadRequestException,
  Post,
  Body,
} from '@nestjs/common';
import { SupabaseService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get('login')
  async signIn(@Query('provider') provider: string, @Res() res: Response) {
    const validProviders = ['google', 'github', 'facebook'];
    if (!provider || !validProviders.includes(provider)) {
      throw new BadRequestException('Invalid or missing OAuth provider');
    }

    const { url } = await this.supabaseService.signInWithOAuth(provider as any);
    res.redirect(url); // Redirect to the Supabase OAuth URL
  }

  @Post('callback')
  async oauthCallback(@Body('access_token') accessToken: string) {
    // Check if the access token is received properly
    if (!accessToken) {
      throw new BadRequestException('Access token is missing');
    }

    // Decode the access token if it's URL-encoded
    const decodedAccessToken = decodeURIComponent(accessToken);

    // Get user details from Supabase
    const user = await this.supabaseService.getUser(decodedAccessToken);

    // Store user details in the database
    const savedUser = await this.supabaseService.storeUserInDatabase(user);

    return { message: 'Logged in successfully', user: savedUser };
  }
}
