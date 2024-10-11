import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class StorageService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
    );
  }

  // Generate a signed URL for uploading files directly from the client
  async generateSignedUrl(fileName: string) {
    const { signedURL, error } = await this.supabase.storage
      .from('images')
      .createSignedUrl(`public/${fileName}`, 60 * 5); // URL expires in 5 minutes

    if (error) {
      throw new Error(error.message);
    }

    return signedURL;
  }
}
