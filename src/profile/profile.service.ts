import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfileService {
  // This method retrieves the profile using session data
  getProfile(sessionUser: any) {
    if (!sessionUser) {
      throw new Error('No session user found');
    }

    // Assuming sessionUser contains user data like id, email, etc.
    return {
      message: 'Profile retrieved successfully',
      user: {
        id: sessionUser.id,
        email: sessionUser.email,
        name: sessionUser.name, // You can store additional data in the session
      },
    };
  }
}
