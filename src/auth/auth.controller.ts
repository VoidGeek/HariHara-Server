import {
  Controller,
  Post,
  Get,
  Body,
  Session,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { createResponse } from '../utils/response.util';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Register a new user
  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('name') name: string,
    @Body('phone') phone: string,
  ) {
    const newUser = await this.authService.register(
      email,
      password,
      name,
      phone,
    );
    return createResponse(
      HttpStatus.CREATED,
      'Registration successful. Please log in.',
      newUser, // Only pass the user data here
    );
  }

  // Login and store user data in session
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Session() session: { user?: any },
  ) {
    if (!session.user) {
      // Authenticate and log in the user
      const { user } = await this.authService.login(email, password, session);
      session.user = { id: user.user_id, name: user.name };

      // Return the user data
      return createResponse(
        HttpStatus.OK,
        'User logged in successfully',
        session.user,
      );
    }

    // User is already logged in, no need to nest another status code
    return createResponse(
      HttpStatus.CONFLICT,
      'User already logged in',
      session.user,
    );
  }

  // Retrieve session data
  @Get('session')
  getSession(@Session() session: { user?: any }) {
    if (session.user) {
      return createResponse(
        HttpStatus.OK,
        'Session retrieved successfully',
        session.user,
      );
    }

    // No active session
    throw new HttpException('No active session', HttpStatus.BAD_REQUEST);
  }

  // Logout
  @Post('logout')
  logout(@Session() session: { user?: any }) {
    if (session.user) {
      session.user = null;
      return createResponse(HttpStatus.OK, 'User logged out successfully');
    }

    // No active session to log out
    throw new HttpException(
      'No active session to log out from',
      HttpStatus.BAD_REQUEST,
    );
  }
}
