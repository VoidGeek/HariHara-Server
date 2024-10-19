import {
  Controller,
  Post,
  Get,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupabaseService } from './supabase.service';
import { SessionAuthGuard } from '../auth/auth.guard'; // Your custom session guard

@Controller('images')
export class ImageController {
  constructor(private supabaseService: SupabaseService) {}

  // Route to upload the image and store the file path in the database
  @Post('upload')
  @UseGuards(SessionAuthGuard) // Ensure only logged-in users can upload
  @UseInterceptors(FileInterceptor('fileBuffer')) // Handle file upload
  async uploadImage(
    @UploadedFile() file: any, // Uploaded file
    @Body('fileName') fileName: string, // File name from FormData
    @Body('altText') altText: string, // Optional alt text
  ) {
    if (!file || !fileName) {
      throw new BadRequestException('File and file name are required');
    }

    return this.supabaseService.uploadToSupabase(
      file.buffer,
      fileName,
      altText,
    );
  }

  // Route to generate and return a signed URL for a specific image
  @Get('signed-url/:imageId')
  @UseGuards(SessionAuthGuard) // Use session guard to protect access to signed URLs
  async getSignedUrl(@Param('imageId') imageId: number) {
    const image = await this.supabaseService.getImageById(imageId);

    if (!image) {
      throw new BadRequestException('Image not found');
    }

    // Generate signed URL on demand
    const signedUrl = await this.supabaseService.generateSignedUrl(
      image.file_path,
    );

    return { signed_url: signedUrl };
  }
}
