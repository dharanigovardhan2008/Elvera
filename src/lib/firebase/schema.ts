// Update Product interface
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  category: 'shirts' | 'pants' | 'jeans' | 'trousers' | 'hoodies' | 'oversized-tshirts';
  priceRange: 'under-1000' | 'under-1500' | 'under-2000';
  platform: 'amazon' | 'flipkart' | 'myntra' | 'ajio';
  affiliateLink: string;
  images: CloudinaryImage[];  // ✅ UPDATED
  rating: number;
  reviews: number;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  featured: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ✅ NEW: Cloudinary Image interface
export interface CloudinaryImage {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
}

// Update Combo interface
export interface Combo {
  id: string;
  name: string;
  description: string;
  items: ComboItem[];
  totalPrice: number;
  originalPrice: number;
  discount: number;
  priceRange: 'under-1500' | 'under-2000';
  images: CloudinaryImage[];  // ✅ UPDATED
  platforms: {
    platform: 'amazon' | 'flipkart' | 'myntra' | 'ajio';
    link: string;
  }[];
  featured: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
