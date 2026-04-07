import { useState } from 'react';
import { cloudinaryStorage } from '@/lib/cloudinary/storage';

interface UploadProgress {
  fileIndex: number;
  progress: number;
  fileName: string;
}

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [error, setError] = useState<string | null>(null);

  const uploadSingle = async (
    file: File,
    folder: 'products' | 'combos' | 'banners'
  ) => {
    const validation = cloudinaryStorage.validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return null;
    }

    try {
      setUploading(true);
      setError(null);

      const result = await cloudinaryStorage.uploadImage(file, folder);

      if (!result) {
        setError('Upload failed');
        return null;
      }

      return result;
    } catch (err) {
      console.error('Upload error:', err);
      setError('Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const uploadMultiple = async (
    files: File[],
    folder: 'products' | 'combos' | 'banners'
  ) => {
    const validation = cloudinaryStorage.validateMultipleFiles(files);
    if (!validation.valid) {
      setError(validation.errors.join(', '));
      return [];
    }

    try {
      setUploading(true);
      setError(null);
      setUploadProgress([]);

      const results = await cloudinaryStorage.uploadMultipleImages(
        files,
        folder,
        (index, total) => {
          setUploadProgress((prev) => {
            const updated = [...prev];
            updated[index - 1] = {
              fileIndex: index - 1,
              progress: 100,
              fileName: files[index - 1].name,
            };
            return updated;
          });
        }
      );

      return results;
    } catch (err) {
      console.error('Upload error:', err);
      setError('Upload failed');
      return [];
    } finally {
      setUploading(false);
      setUploadProgress([]);
    }
  };

  return {
    uploading,
    uploadProgress,
    error,
    uploadSingle,
    uploadMultiple,
  };
};
