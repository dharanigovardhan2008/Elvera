import { Timestamp } from 'firebase/firestore';

// User Interface
export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  favorites: string[];
  cart: CartItem[];
  createdAt: Timestamp;
  lastLogin: Timestamp;
}

// Cart Item Interface
export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: Timestamp;
}

// Product Interface
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
  images: string[];
  rating: number;
  reviews: number;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  featured: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Combo Interface
export interface Combo {
  id: string;
  name: string;
  description: string;
  items: ComboItem[];
  totalPrice: number;
  originalPrice: number;
  discount: number;
  priceRange: 'under-1500' | 'under-2000';
  images: string[];
  platforms: {
    platform: 'amazon' | 'flipkart' | 'myntra' | 'ajio';
    link: string;
  }[];
  featured: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Combo Item Interface
export interface ComboItem {
  productId: string;
  type: 'shirt' | 'pant' | 'shoes';
  name: string;
  image: string;
  price: number;
}

// Click Analytics Interface
export interface ClickAnalytics {
  id: string;
  userId: string | null;
  productId: string;
  productTitle: string;
  platform: string;
  timestamp: Timestamp;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
}

// Admin User Interface
export interface AdminUser {
  uid: string;
  email: string;
  role: 'admin' | 'super-admin';
  permissions: string[];
  createdAt: Timestamp;
}

// Filter Types
export type CategoryType = Product['category'];
export type PriceRangeType = Product['priceRange'];
export type PlatformType = Product['platform'];

// Product Filters Interface
export interface ProductFilters {
  category?: CategoryType;
  priceRange?: PriceRangeType;
  platform?: PlatformType;
  minRating?: number;
  inStock?: boolean;
  featured?: boolean;
  searchTerm?: string;
}
