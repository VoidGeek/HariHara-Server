import {
  Controller,
  Post,
  Get,
  Body,
  Session,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { BaseService } from 'src/common/utils/base.service'; // Import BaseService

@Controller('auth')
export class AuthController extends BaseService {
  constructor(private readonly authService: AuthService) {
    super();
  }

  // Register a new user
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const newUser = await this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.name,
      registerDto.phone,
      registerDto.role_id,
    );
    return newUser; // The ResponseInterceptor will format the response
  }

  // Login and store user data in session
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Session() session: { user?: any }) {
    if (!session.user) {
      const user = await this.authService.login(
        loginDto.email,
        loginDto.password,
      );
      session.user = { id: user.user_id, name: user.name }; // Store user in session
      return session.user;
    }

    // User already logged in, using the constant from Map
    this.throwHttpException('ALREADY_LOGGED_IN', HttpStatus.CONFLICT);
  }

  // Retrieve session data
  @Get('session')
  getSession(@Session() session: { user?: any }) {
    if (session.user) {
      return session.user;
    }

    // No active session, using the constant from Map
    this.throwHttpException('NO_ACTIVE_SESSION', HttpStatus.BAD_REQUEST);
  }

  // Logout and clear the session
  @Post('logout')
  logout(@Session() session: { user?: any }) {
    if (session.user) {
      session.user = null;
      return { message: 'User logged out successfully' };
    }

    // No active session to log out, using the constant from Map
    this.throwHttpException('NO_ACTIVE_SESSION', HttpStatus.BAD_REQUEST);
  }
}
