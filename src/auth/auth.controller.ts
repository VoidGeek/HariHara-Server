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
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Register a new user
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const newUser = await this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.name,
      registerDto.phone,
    );
    return newUser; // The ResponseInterceptor will format the response
  }

  // Login and store user data in session
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Session() session: { user?: any }) {
    if (!session.user) {
      // Authenticate and log in the user
      const user = await this.authService.login(
        loginDto.email,
        loginDto.password,
      );
      session.user = { id: user.user_id, name: user.name }; // Store user in session

      return session.user; // ResponseInterceptor will format this
    }

    // User is already logged in
    throw new HttpException('User already logged in', HttpStatus.CONFLICT);
  }

  // Retrieve session data
  @Get('session')
  getSession(@Session() session: { user?: any }) {
    if (session.user) {
      return session.user; // ResponseInterceptor will format this
    }

    // No active session
    throw new HttpException('No active session', HttpStatus.BAD_REQUEST);
  }

  // Logout and clear the session
  @Post('logout')
  logout(@Session() session: { user?: any }) {
    if (session.user) {
      // Clear the user session
      session.user = null;
      return { message: 'User logged out successfully' }; // ResponseInterceptor formats this
    }

    // No active session to log out
    throw new HttpException(
      'No active session to log out from',
      HttpStatus.BAD_REQUEST,
    );
  }
}
