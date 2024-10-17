import { Controller, Post, Get, Session } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Login and store user data in session
  @Post('login')
  login(@Session() session: { user?: any }) {
    if (!session.user) {
      // Set user data in the session only if not already set
      session.user = { id: 1, name: 'John Doe' }; // Example data
      return { message: 'User logged in successfully', user: session.user };
    }
    return { message: 'User already logged in', user: session.user };
  }

  // Retrieve session data
  @Get('session')
  getSession(@Session() session: { user?: any }) {
    // Return session data if available, otherwise show a clear message
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
