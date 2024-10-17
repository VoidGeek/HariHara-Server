import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SessionAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Access user information from the session
    const user = request.session?.user;

    if (!user) {
      throw new UnauthorizedException('No user session found');
    }

    // Attach the user object to the request so that it can be used in handlers
    request.user = user;

    return true; // Allow the request to proceed if the user exists
  }
}
