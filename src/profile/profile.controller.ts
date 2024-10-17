import { Controller, Get, Session } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getProfile(@Session() session: { user?: any }) {
    if (!session.user) {
      return { message: 'No user logged in' };
    }

    // You can fetch the user profile based on session data
    return this.profileService.getProfile(session.user);
  }
}
