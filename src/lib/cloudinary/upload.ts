import { cloudName, uploadPreset } from './config';

export async function uploadToCloudinary(file: File) {
  if (!cloudName || !uploadPreset) {
    throw new Error('Missing Cloudinary configuration');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Cloudinary upload failed');
  }

  return await response.json();
}
