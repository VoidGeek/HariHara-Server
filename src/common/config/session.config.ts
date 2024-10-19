import { NestCookieSessionOptions } from 'nestjs-cookie-session';
import { ConfigService } from '@nestjs/config';

// Utility to provide session configuration
export function getSessionConfig(
  configService: ConfigService,
): NestCookieSessionOptions {
  return {
    session: {
      secret: configService.get('SESSION_SECRET') || 'your-session-secret',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 1 month in milliseconds
      httpOnly: true, // Ensure cookies are not accessible via JavaScript
    },
  };
}
