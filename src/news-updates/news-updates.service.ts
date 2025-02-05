import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class NewsUpdatesService {
  constructor(
    private prisma: PrismaService,
    private supabaseService: SupabaseService,
  ) {}

  // Create a news update
  async createNewsUpdate(data: {
    title: string;
    content: string;
    title_kannada?: string;
    content_kannada?: string;
    created_by: number;
    imageIds: number[];
  }) {
    const {
      title,
      content,
      title_kannada,
      content_kannada,
      created_by,
      imageIds,
    } = data;

    const newsUpdate = await this.prisma.newsUpdates.create({
      data: {
        title,
        content,
        title_kannada,
        content_kannada,
        created_by,
        NewsImages: {
          create: imageIds.map((id) => ({ image_id: id })),
        },
      },
      include: {
        NewsImages: {
          include: {
            Images: true,
          },
        },
      },
    });

    // Add public_url to each image
    newsUpdate.NewsImages = await Promise.all(
      newsUpdate.NewsImages.map(async (newsImage) => {
        const image = newsImage.Images;
        return {
          ...newsImage,
          Images: {
            ...image,
            public_url: this.supabaseService.getPublicUrl(image.file_path),
          },
        };
      }),
    );

    return newsUpdate;
  }

  // Update a news update
  async updateNewsUpdate(
    newsId: number,
    data: {
      title?: string;
      content?: string;
      title_kannada?: string;
      content_kannada?: string;
      updated_by: number;
      imageIds?: number[];
    },
  ) {
    const news = await this.prisma.newsUpdates.findUnique({
      where: { news_id: newsId },
    });

    if (!news) {
      throw new NotFoundException('News update not found');
    }

    const { title, content, title_kannada, content_kannada, imageIds } = data;

    const updatedNewsUpdate = await this.prisma.newsUpdates.update({
      where: { news_id: newsId },
      data: {
        title,
        content,
        title_kannada,
        content_kannada,
        updated_at: new Date(),
        NewsImages: imageIds
          ? {
              deleteMany: {}, // Remove existing images
              create: imageIds.map((id) => ({ image_id: id })), // Add new images
            }
          : undefined,
      },
      include: {
        NewsImages: {
          include: {
            Images: true,
          },
        },
      },
    });

    // Add public_url to each image
    updatedNewsUpdate.NewsImages = await Promise.all(
      updatedNewsUpdate.NewsImages.map(async (newsImage) => {
        const image = newsImage.Images;
        return {
          ...newsImage,
          Images: {
            ...image,
            public_url: this.supabaseService.getPublicUrl(image.file_path),
          },
        };
      }),
    );

    return updatedNewsUpdate;
  }

  // Delete a news update and its associated images
  async deleteNewsUpdate(newsId: number) {
    // Check if the news update exists
    const news = await this.prisma.newsUpdates.findUnique({
      where: { news_id: newsId },
      include: {
        NewsImages: {
          include: {
            Images: true, // Ensure associated images are included
          },
        },
      },
    });

    if (!news) {
      throw new NotFoundException('News update not found');
    }

    // Collect all associated image IDs
    const imageIds = news.NewsImages?.map(
      (newsImage) => newsImage.Images?.image_id,
    );

    // Delete rows in the NewsImages table
    await this.prisma.newsImages.deleteMany({
      where: { news_id: newsId },
    });

    // Delete the news update itself
    const deletedNews = await this.prisma.newsUpdates.delete({
      where: { news_id: newsId },
    });

    // Delete the associated images after deleting the news update
    if (imageIds && imageIds.length > 0) {
      for (const imageId of imageIds) {
        if (imageId) {
          await this.supabaseService.deleteImage(imageId);
        }
      }
    }

    return {
      message: 'News update and associated images deleted successfully',
      deletedNews,
    };
  }

  // Get a single news update by ID
  async getNewsUpdateById(newsId: number) {
    const news = await this.prisma.newsUpdates.findUnique({
      where: { news_id: newsId },
      include: {
        NewsImages: {
          include: {
            Images: true,
          },
        },
      },
    });

    if (!news) {
      throw new NotFoundException('News update not found');
    }

    // Add public_url to each image
    news.NewsImages = await Promise.all(
      news.NewsImages.map(async (newsImage) => {
        const image = newsImage.Images;
        return {
          ...newsImage,
          Images: {
            ...image,
            public_url: this.supabaseService.getPublicUrl(image.file_path),
          },
        };
      }),
    );

    return news;
  }

  // Get all news updates
  async getAllNewsUpdates() {
    const newsUpdates = await this.prisma.newsUpdates.findMany({
      include: {
        NewsImages: {
          include: {
            Images: true,
          },
        },
      },
    });

    // Add public_url to each image for all news updates
    const updatedNewsUpdates = await Promise.all(
      newsUpdates.map(async (newsUpdate) => {
        const updatedNewsImages = await Promise.all(
          newsUpdate.NewsImages.map(async (newsImage) => {
            const image = newsImage.Images;
            return {
              ...newsImage,
              Images: {
                ...image,
                public_url: this.supabaseService.getPublicUrl(image.file_path),
              },
            };
          }),
        );

        return {
          ...newsUpdate,
          NewsImages: updatedNewsImages,
        };
      }),
    );

    return updatedNewsUpdates;
  }
}
