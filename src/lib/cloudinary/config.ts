import { v2 as cloudinary } from 'cloudinary';

// Server-side configuration (for API routes)
cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Client-side cloud name for direct uploads
export const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME || '';
