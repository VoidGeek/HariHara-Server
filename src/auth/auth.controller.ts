import { Controller, Post, Get, Body, Session } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Dynamic login and store user data in session
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Session() session: { user?: any },
  ) {
    if (!session.user) {
      // Call AuthService to authenticate user
      const { user } = await this.authService.login(email, password, session);

      // Set user data in the session
      session.user = { id: user.user_id, name: user.name };

      return { message: 'User logged in successfully', user: session.user };
    }

    return { message: 'User already logged in', user: session.user };
  }

  // Retrieve session data
  @Get('session')
  getSession(@Session() session: { user?: any }) {
    return session.user
      ? { message: 'User session available', user: session.user }
      : { message: 'No active session' };
  }

  // Clear session data on logout
  @Post('logout')
  logout(@Session() session: { user?: any }) {
    if (session.user) {
      session.user = null; // Clear session data only if a user is logged in
      return { message: 'User logged out successfully' };
    }
    return { message: 'No active session to log out from' };
  }
}
