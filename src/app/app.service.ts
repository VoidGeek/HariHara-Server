import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  intro(): string {
    return 'HariHara Server!';
  }
}
