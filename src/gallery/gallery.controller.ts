import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { GalleryDto } from './dto/gallery.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Controller('gallery')
export class GalleryController {
  constructor(
    private readonly galleryService: GalleryService,
    private readonly supabaseService: SupabaseService,
  ) {}

  @Post('create')
  async createGallery(
    @Body('title') title: string,
    @Body('imageId') imageId: number,
  ) {
    if (!title) {
      throw new BadRequestException('Title is required.');
    }
    if (!imageId) {
      throw new BadRequestException('Image ID is required.');
    }

    return this.galleryService.createGallery(title, imageId);
  }

  @Put('update/:id')
  async updateGallery(
    @Param('id') galleryId: number,
    @Body('title') title: string,
    @Body('imageId') imageId: number,
  ) {
    if (!title) {
      throw new BadRequestException('Title is required.');
    }
    if (!imageId) {
      throw new BadRequestException('Image ID is required.');
    }

    return this.galleryService.updateGallery(galleryId, title, imageId);
  }

  @Delete('delete/:id')
  async deleteGallery(@Param('id') galleryId: number) {
    return this.galleryService.deleteGallery(galleryId);
  }

  @Get(':id')
  async getGalleryById(@Param('id') galleryId: number): Promise<GalleryDto> {
    const gallery = await this.galleryService.getGalleryById(galleryId);

    if (gallery && gallery.Images) {
      gallery.Images = {
        ...gallery.Images,
        public_url: this.supabaseService.getPublicUrl(gallery.Images.file_path),
      } as any; // Use type assertion to bypass TypeScript error
    }

    return gallery as GalleryDto;
  }

  @Get()
  async getAllGalleries(): Promise<GalleryDto[]> {
    const galleries = await this.galleryService.getAllGalleries();

    return galleries.map((gallery) => {
      if (gallery.Images) {
        gallery.Images = {
          ...gallery.Images,
          public_url: this.supabaseService.getPublicUrl(
            gallery.Images.file_path,
          ),
        } as any; // Use type assertion here as well
      }
      return gallery as GalleryDto;
    });
  }
}
