import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import * as mime from 'mime-types';

@Injectable()
export class SupabaseService {
  private supabase;
  private bucket = 'harihara_image';

  constructor(private prisma: PrismaService) {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
    );
  }

  async uploadToSupabase(fileBuffer: Buffer, userId: number) {
    const fileExtension = mime.extension('image/jpeg') || 'jpg';
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = `images/${fileName}`;
    const altText = this.generateAltText(fileName);

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .upload(filePath, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) {
      throw new BadRequestException('Failed to upload image to Supabase');
    }

    return this.prisma.images.create({
      data: {
        file_path: filePath,
        alt_text: altText,
        created_by: userId,
        created_at: new Date(),
      },
    });
  }

  async updateImage(imageId: number, fileBuffer: Buffer, userId: number) {
    const fileExtension = mime.extension('image/jpeg') || 'jpg';
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = `images/${fileName}`;
    const altText = this.generateAltText(fileName);

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .upload(filePath, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) {
      throw new BadRequestException('Failed to upload image to Supabase');
    }

    return this.prisma.images.update({
      where: { image_id: imageId },
      data: {
        file_path: filePath,
        alt_text: altText,
        modified_by: userId,
        modified_at: new Date(),
      },
    });
  }

  private generateAltText(fileName: string): string {
    const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
    return nameWithoutExtension.replace(/[_-]/g, ' ');
  }

  getPublicUrl(filePath: string): string {
    return `${process.env.SUPABASE_URL}/storage/v1/object/public/${this.bucket}/${filePath}`;
  }

  async getImagesBatch(limit: number, page: number) {
    const skip = (page - 1) * limit;
    return this.prisma.images.findMany({
      skip,
      take: limit,
    });
  }

  async deleteImage(imageId: number, userId: number) {
    const imageRecord = await this.prisma.images.findUnique({
      where: { image_id: imageId },
    });

    if (!imageRecord) {
      throw new NotFoundException('Image not found');
    }

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .remove([imageRecord.file_path]);

    if (error) {
      throw new BadRequestException('Failed to delete image from Supabase');
    }

    await this.prisma.images.delete({
      where: { image_id: imageId },
    });

    return { message: 'Image deleted successfully' };
  }
}
