import { Controller, Get, Query } from '@nestjs/common';
import { StorageService } from './storage.service';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  // Endpoint to get a signed URL for uploading
  @Get('signed-url')
  async getSignedUrl(@Query('fileName') fileName: string) {
    const signedUrl = await this.storageService.generateSignedUrl(fileName);
    return { message: 'Signed URL generated', signedUrl };
  }
}
