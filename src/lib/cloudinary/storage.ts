import { cloudName } from './config';

export const cloudinaryStorage = {
  // Upload single image (Client-side unsigned upload)
  async uploadImage(
    file: File,
    folder: 'products' | 'combos' | 'banners',
    publicId?: string
  ): Promise<{ url: string; publicId: string } | null> {
    try {
      const base64 = await this.fileToBase64(file);

      const formData = new FormData();
      formData.append('file', base64);
      formData.append('upload_preset', 'elvera_unsigned'); // You'll create this in Cloudinary
      formData.append('folder', `elvera/${folder}`);
      if (publicId) {
        formData.append('public_id', publicId);
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        return {
          url: data.secure_url,
          publicId: data.public_id,
        };
      }

      return null;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      return null;
    }
  },

  // Upload multiple images
  async uploadMultipleImages(
    files: File[],
    folder: 'products' | 'combos' | 'banners',
    onProgress?: (index: number, total: number) => void
  ): Promise<{ url: string; publicId: string }[]> {
    try {
      const results = [];

      for (let i = 0; i < files.length; i++) {
        const result = await this.uploadImage(files[i], folder);
        if (result) {
          results.push(result);
        }
        if (onProgress) {
          onProgress(i + 1, files.length);
        }
      }

      return results;
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      return [];
    }
  },

  // Note: Delete requires Admin API (backend)
  // For now, mark images as "deleted" in Firebase instead
  async markAsDeleted(publicId: string): Promise<boolean> {
    console.warn('Client-side deletion not supported. Mark as deleted in database.');
    return true;
  },

  // Get optimized image URL
  getOptimizedUrl(
    publicId: string,
    options?: {
      width?: number;
      height?: number;
      crop?: 'fill' | 'fit' | 'scale' | 'crop';
      quality?: 'auto' | number;
      format?: 'auto' | 'webp' | 'jpg' | 'png';
    }
  ): string {
    const {
      width,
      height,
      crop = 'fill',
      quality = 'auto',
      format = 'auto',
    } = options || {};

    let transformation = 'f_auto,q_auto';

    if (width) transformation += `,w_${width}`;
    if (height) transformation += `,h_${height}`;
    if (crop) transformation += `,c_${crop}`;

    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformation}/${publicId}`;
  },

  // Get thumbnail URL
  getThumbnailUrl(publicId: string, size: number = 200): string {
    return this.getOptimizedUrl(publicId, {
      width: size,
      height: size,
      crop: 'fill',
      quality: 'auto',
    });
  },

  // Convert File to Base64
  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  },

  // Validate image file
  validateImageFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.',
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size too large. Maximum size is 10MB.',
      };
    }

    return { valid: true };
  },

  // Validate multiple files
  validateMultipleFiles(files: File[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    files.forEach((file, index) => {
      const validation = this.validateImageFile(file);
      if (!validation.valid) {
        errors.push(`File ${index + 1}: ${validation.error}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  },
};
