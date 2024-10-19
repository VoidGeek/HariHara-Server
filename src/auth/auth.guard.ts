import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { getSessionUser } from '../common/utils/session.util'; // Utility for session checks

@Injectable()
export class SessionAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = getSessionUser(request); // Check and extract user from session
    request.user = user; // Attach the user to the request
    return true;
  }
}
