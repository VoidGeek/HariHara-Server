import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid'; // For generating unique file names
import * as mime from 'mime-types'; // For guessing file type

@Injectable()
export class SupabaseService {
  private supabase;

  constructor(private prisma: PrismaService) {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
    );
  }

  // Upload method with created_by and timestamps
  async uploadToSupabase(fileBuffer: Buffer, userId: number) {
    const bucket = 'harihara_image';
    const fileExtension = mime.extension('image/jpeg') || 'jpg'; // Assuming the file is JPEG
    const fileName = `${uuidv4()}.${fileExtension}`; // Generate a unique file name
    const filePath = `images/${fileName}`;

    // Generate alt text by converting file name (without extension) to a more readable format
    const altText = this.generateAltText(fileName);

    const { error } = await this.supabase.storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        contentType: 'image/jpeg', // Adjust based on the file type you're uploading
        upsert: true,
      });

    if (error) {
      throw new BadRequestException('Failed to upload image to Supabase');
    }

    // Store the file path, alt text, user info, and timestamps in the database
    return this.prisma.images.create({
      data: {
        file_path: filePath,
        alt_text: altText,
        created_by: userId, // Track the user who uploaded the image
        created_at: new Date(), // Automatically set timestamp for creation
      },
    });
  }

  // Method for updating an image (this will update modified_by and modified_at)
  async updateImage(imageId: number, fileBuffer: Buffer, userId: number) {
    const bucket = 'harihara_image';
    const fileExtension = mime.extension('image/jpeg') || 'jpg'; // Assuming the file is JPEG
    const fileName = `${uuidv4()}.${fileExtension}`; // Generate a unique file name
    const filePath = `images/${fileName}`;

    // Generate alt text by converting file name (without extension) to a more readable format
    const altText = this.generateAltText(fileName);

    const { error } = await this.supabase.storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) {
      throw new BadRequestException('Failed to upload image to Supabase');
    }

    // Update the existing image entry with new file path, alt text, modified_by, and modified_at
    return this.prisma.images.update({
      where: { image_id: imageId },
      data: {
        file_path: filePath,
        alt_text: altText,
        modified_by: userId, // Track the user who modified the image
        modified_at: new Date(), // Automatically update the modification timestamp
      },
    });
  }

  // Generate alt text from file name (removing extension and replacing characters)
  private generateAltText(fileName: string): string {
    // Remove file extension and replace dashes/underscores with spaces
    const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
    return nameWithoutExtension.replace(/[_-]/g, ' ');
  }

  async generateSignedUrl(filePath: string) {
    const bucket = 'harihara_image';
    const { data: signedUrlData, error: urlError } = await this.supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, 60 * 60); // 1-hour expiry

    if (urlError || !signedUrlData?.signedUrl) {
      throw new BadRequestException('Failed to generate signed URL');
    }

    return signedUrlData.signedUrl;
  }

  // Fetch a batch of images with pagination
  async getImagesBatch(limit: number, page: number) {
    const skip = (page - 1) * limit; // Pagination logic
    return this.prisma.images.findMany({
      skip,
      take: limit,
    });
  }

  // Fetch an image by its ID
  async getImageById(imageId: number) {
    return this.prisma.images.findUnique({ where: { image_id: imageId } });
  }

  // Method to delete an image
  async deleteImage(imageId: number, userId: number) {
    // Fetch the image record from the database
    const imageRecord = await this.prisma.images.findUnique({
      where: { image_id: imageId },
    });

    if (!imageRecord) {
      throw new NotFoundException('Image not found');
    }

    // Remove the image from Supabase bucket
    const { error } = await this.supabase.storage
      .from('harihara_image')
      .remove([imageRecord.file_path]);

    if (error) {
      throw new BadRequestException('Failed to delete image from Supabase');
    }

    // Delete the image record from the database
    await this.prisma.images.delete({
      where: { image_id: imageId },
    });

    return { message: 'Image deleted successfully' };
  }
}
