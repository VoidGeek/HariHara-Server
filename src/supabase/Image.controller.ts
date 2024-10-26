import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Param,
  BadRequestException,
  Query,
  Req,
  SetMetadata,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupabaseService } from './supabase.service';
import { SessionAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('images')
export class ImageController {
  constructor(private supabaseService: SupabaseService) {}

  @UseGuards(RolesGuard)
  @SetMetadata('role', 'Admin')
  @Post('upload')
  @UseGuards(SessionAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: any, @Req() req: any) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const userId = req.session?.user?.id;
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    return this.supabaseService.uploadToSupabase(file.buffer, userId);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('role', 'Admin')
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

    const userId = req.session?.user?.id;
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    return this.supabaseService.updateImage(imageId, file.buffer, userId);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('role', 'Admin')
  @Delete(':imageId')
  @UseGuards(SessionAuthGuard)
  async deleteImage(@Param('imageId') imageId: number, @Req() req: any) {
    const userId = req.session?.user?.id;
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    return this.supabaseService.deleteImage(imageId, userId);
  }

  @Get('batch')
  async getImageBatch(@Query('limit') limit = '10', @Query('page') page = '1') {
    const limitNum = parseInt(limit, 10);
    const pageNum = parseInt(page, 10);

    const images = await this.supabaseService.getImagesBatch(limitNum, pageNum);
    const imagesWithPublicUrls = images.map((image) => ({
      ...image,
      public_url: this.supabaseService.getPublicUrl(image.file_path),
    }));
    return { images: imagesWithPublicUrls };
  }
}
