import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SessionAuthGuard } from './auth.guard';

@Global() // This makes the AuthModule global
@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, SessionAuthGuard],
  exports: [AuthService, SessionAuthGuard], // Export AuthService and SessionAuthGuard globally
})
export class AuthModule {}
