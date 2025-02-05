// dto/gallery.dto.ts
export class ImageWithPublicUrlDto {
  image_id: number;
  alt_text: string;
  file_path: string;
  created_by: number;
  created_at: Date;
  modified_by: number | null;
  modified_at: Date;
  public_url: string; // Optional property to avoid strict type checks
}

export class GalleryDto {
  gallery_id: number;
  title: string;
  image_id: number;
  Images: ImageWithPublicUrlDto;
}
