import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  UploadTask,
} from 'firebase/storage';
import { storage } from './config';

export const storageService = {
  // Upload single product image
  async uploadProductImage(
    file: File,
    productId: string,
    onProgress?: (progress: number) => void
  ): Promise<string | null> {
    try {
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const filename = `${timestamp}_${sanitizedFileName}`;
      const storageRef = ref(storage, `products/${productId}/${filename}`);

      if (onProgress) {
        // Upload with progress tracking
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              onProgress(progress);
            },
            (error) => {
              console.error('Upload error:', error);
              reject(null);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            }
          );
        });
      } else {
        // Simple upload
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  },

  // Upload multiple images
  async uploadMultipleImages(
    files: File[],
    productId: string,
    onProgress?: (fileIndex: number, progress: number) => void
  ): Promise<string[]> {
    try {
      const uploadPromises = files.map((file, index) =>
        this.uploadProductImage(file, productId, (progress) => {
          if (onProgress) onProgress(index, progress);
        })
      );

      const urls = await Promise.all(uploadPromises);
      return urls.filter((url) => url !== null) as string[];
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      return [];
    }
  },

  // Upload combo images
  async uploadComboImage(
    file: File,
    comboId: string,
    onProgress?: (progress: number) => void
  ): Promise<string | null> {
    try {
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const filename = `${timestamp}_${sanitizedFileName}`;
      const storageRef = ref(storage, `combos/${comboId}/${filename}`);

      if (onProgress) {
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              onProgress(progress);
            },
            (error) => {
              console.error('Upload error:', error);
              reject(null);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            }
          );
        });
      } else {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      }
    } catch (error) {
      console.error('Error uploading combo image:', error);
      return null;
    }
  },

  // Upload banner image
  async uploadBannerImage(
    file: File,
    bannerId: string
  ): Promise<string | null> {
    try {
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const filename = `${timestamp}_${sanitizedFileName}`;
      const storageRef = ref(storage, `banners/${bannerId}/${filename}`);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading banner:', error);
      return null;
    }
  },

  // Delete image by URL
  async deleteImage(imageUrl: string): Promise<boolean> {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  },

  // Delete all images in a folder
  async deleteAllImagesInFolder(folderPath: string): Promise<boolean> {
    try {
      const folderRef = ref(storage, folderPath);
      const result = await listAll(folderRef);

      const deletePromises = result.items.map((item) => deleteObject(item));
      await Promise.all(deletePromises);

      return true;
    } catch (error) {
      console.error('Error deleting folder images:', error);
      return false;
    }
  },

  // Get all images for a product
  async getProductImages(productId: string): Promise<string[]> {
    try {
      const listRef = ref(storage, `products/${productId}`);
      const result = await listAll(listRef);

      const urlPromises = result.items.map((item) => getDownloadURL(item));
      return await Promise.all(urlPromises);
    } catch (error) {
      console.error('Error getting product images:', error);
      return [];
    }
  },

  // Validate image file
  validateImageFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.',
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size too large. Maximum size is 5MB.',
      };
    }

    return { valid: true };
  },

  // Compress image before upload (optional)
  async compressImage(file: File, maxWidth: number = 1200): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Compression failed'));
              }
            },
            'image/jpeg',
            0.8
          );
        };
      };
      reader.onerror = (error) => reject(error);
    });
  },
};
