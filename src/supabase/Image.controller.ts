import {
  Controller,
  Post,
  Get,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Param,
  BadRequestException,
  Query,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupabaseService } from './supabase.service';
import { SessionAuthGuard } from '../auth/auth.guard';

@Controller('images')
export class ImageController {
  constructor(private supabaseService: SupabaseService) {}

  @Post('upload')
  @UseGuards(SessionAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: any, @Req() req: any) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // Access userId from session (stored during login)
    const userId = req.session?.user?.id; // Extracts userId from session
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    // Call the service to handle the upload, passing the userId
    return this.supabaseService.uploadToSupabase(file.buffer, userId);
  }

  @Put('update/:imageId')
  @UseGuards(SessionAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateImage(
    @Param('imageId') imageId: number,
    @UploadedFile() file: any,
    @Req() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // Access userId from session
    const userId = req.session?.user?.id;
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    // Call the service to handle the update, passing the userId
    return this.supabaseService.updateImage(imageId, file.buffer, userId);
  }

  @Get('signed-url/:imageId')
  @UseGuards(SessionAuthGuard)
  async getSignedUrl(@Param('imageId') imageId: number) {
    const image = await this.supabaseService.getImageById(imageId);
    if (!image) {
      throw new BadRequestException('Image not found');
    }
    const signedUrl = await this.supabaseService.generateSignedUrl(
      image.file_path,
    );
    return { signed_url: signedUrl };
  }

  @Get('batch')
  @UseGuards(SessionAuthGuard)
  async getImageBatch(@Query('limit') limit = '10', @Query('page') page = '1') {
    const limitNum = parseInt(limit, 10);
    const pageNum = parseInt(page, 10);

    const images = await this.supabaseService.getImagesBatch(limitNum, pageNum);
    const imagesWithSignedUrls = await Promise.all(
      images.map(async (image) => {
        const signedUrl = await this.supabaseService.generateSignedUrl(
          image.file_path,
        );
        return {
          ...image,
          signed_url: signedUrl,
        };
      }),
    );
    return { images: imagesWithSignedUrls };
  }
}
