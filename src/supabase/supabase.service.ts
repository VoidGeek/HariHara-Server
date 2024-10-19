import { Injectable, BadRequestException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SupabaseService {
  private supabase;

  constructor(private prisma: PrismaService) {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
    );
  }

  // Upload image and store file path in database
  async uploadToSupabase(
    fileBuffer: Buffer,
    fileName: string,
    altText: string,
  ) {
    const bucket = 'harihara_image'; // Ensure this matches the bucket name
    const filePath = `images/${fileName}`;

    // Upload the image to Supabase
    const { error } = await this.supabase.storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        contentType: 'image/jpeg', // Adjust based on the file type you're uploading
        upsert: true, // If you want to overwrite existing files with the same name
      });

    if (error) {
      console.error('Supabase Upload Error:', error);
      throw new BadRequestException('Failed to upload image to Supabase');
    }

    // Store the file path in the database, not the signed URL
    const image = await this.prisma.images.create({
      data: {
        file_path: filePath,
        alt_text: altText,
      },
    });

    return image;
  }

  // Generate signed URL for a given file path
  async generateSignedUrl(filePath: string) {
    const bucket = 'harihara_image'; // Your bucket name
    const { data: signedUrlData, error: urlError } = await this.supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, 60 * 60); // URL valid for 1 hour

    if (urlError || !signedUrlData?.signedUrl) {
      throw new BadRequestException('Failed to generate signed URL');
    }

    return signedUrlData.signedUrl;
  }

  // Fetch image data by ID
  async getImageById(imageId: number) {
    return this.prisma.images.findUnique({
      where: { image_id: imageId },
    });
  }
}
