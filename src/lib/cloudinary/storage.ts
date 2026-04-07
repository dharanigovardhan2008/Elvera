import { cloudName } from "./config";

export const cloudinaryStorage = {
  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  },

  validateImageFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024;
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: "Only JPG, JPEG, PNG, WEBP images are allowed.",
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: "Image size must be less than 10MB.",
      };
    }

    return { valid: true };
  },

  validateMultipleFiles(files: File[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    files.forEach((file, index) => {
      const result = this.validateImageFile(file);
      if (!result.valid && result.error) {
        errors.push(`File ${index + 1}: ${result.error}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  async uploadImage(
    file: File,
    folder: "products" | "combos" | "banners"
  ): Promise<{ url: string; publicId: string } | null> {
    try {
      const base64 = await this.fileToBase64(file);

      const formData = new FormData();
      formData.append("file", base64);
      formData.append("upload_preset", "elvera_unsigned");
      formData.append("folder", `elvera/${folder}`);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      console.log("CLOUDINARY RESPONSE:", data);

      if (!response.ok) {
        console.error("Cloudinary upload HTTP error:", response.status, data);
        return null;
      }

      if (!data.secure_url || !data.public_id) {
        console.error("Cloudinary upload failed:", data);
        return null;
      }

      return {
        url: data.secure_url,
        publicId: data.public_id,
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  },

  async uploadMultipleImages(
    files: File[],
    folder: "products" | "combos" | "banners",
    onProgress?: (index: number, total: number) => void
  ): Promise<{ url: string; publicId: string }[]> {
    try {
      const results: { url: string; publicId: string }[] = [];

      for (let i = 0; i < files.length; i++) {
        const uploaded = await this.uploadImage(files[i], folder);
        if (uploaded) {
          results.push(uploaded);
        }
        if (onProgress) {
          onProgress(i + 1, files.length);
        }
      }

      return results;
    } catch (error) {
      console.error("Error uploading multiple images:", error);
      return [];
    }
  },

  getOptimizedUrl(
    publicId: string,
    options?: {
      width?: number;
      height?: number;
      crop?: "fill" | "fit" | "scale" | "crop";
      quality?: "auto" | number;
    }
  ): string {
    const { width, height, crop = "fill", quality = "auto" } = options || {};

    let transformations = `f_auto,q_${quality}`;
    if (width) transformations += `,w_${width}`;
    if (height) transformations += `,h_${height}`;
    if (crop) transformations += `,c_${crop}`;

    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
  },

  getThumbnailUrl(publicId: string, size: number = 300): string {
    return this.getOptimizedUrl(publicId, {
      width: size,
      height: size,
      crop: "fill",
      quality: "auto",
    });
  },
};
