import { UnauthorizedException } from '@nestjs/common';

export function getSessionUser(request: any) {
  const user = request.session?.user;
  if (!user) {
    throw new UnauthorizedException('No user session found');
  }
  return user;
}
