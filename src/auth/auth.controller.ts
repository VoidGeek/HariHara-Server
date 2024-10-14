import {
  Controller,
  Get,
  Query,
  Res,
  Post,
  Body,
  BadRequestException,
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
    res.redirect(url);
  }

  @Post('callback')
  async oauthCallback(@Body('access_token') accessToken: string) {
    if (!accessToken) {
      throw new BadRequestException('Access token is missing');
    }

    const decodedAccessToken = decodeURIComponent(accessToken);

    // Check if the session has been invalidated before allowing access
    const sessionValid =
      await this.supabaseService.isSessionValid(decodedAccessToken);
    if (!sessionValid) {
      throw new BadRequestException(
        'Session has been invalidated. Please log in again.',
      );
    }

    const user = await this.supabaseService.getUser(decodedAccessToken);
    const savedUser = await this.supabaseService.storeUserInDatabase(
      user,
      true,
    );
    return { message: 'Logged in successfully', user: savedUser };
  }

  @Post('logout')
  async logout(
    @Body('access_token') accessToken: string,
    @Res() res: Response,
  ) {
    if (!accessToken) {
      throw new BadRequestException('Access token is missing');
    }

    const decodedAccessToken = decodeURIComponent(accessToken);

    // Invalidate the session
    await this.supabaseService.logout(decodedAccessToken);
    return res.json({
      message: 'Logged out successfully',
    });
  }
}
