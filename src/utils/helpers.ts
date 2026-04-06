import { Product, Combo } from '@/types';

// Format price to INR
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

// Calculate discount percentage
export const calculateDiscount = (original: number, current: number): number => {
  return Math.round(((original - current) / original) * 100);
};

// Format date
export const formatDate = (date: Date | any): string => {
  if (!date) return '';
  
  const d = date.toDate ? date.toDate() : new Date(date);
  
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get platform logo
export const getPlatformLogo = (platform: string): string => {
  const logos: { [key: string]: string } = {
    amazon: '/logos/amazon.svg',
    flipkart: '/logos/flipkart.svg',
    myntra: '/logos/myntra.svg',
    ajio: '/logos/ajio.svg',
  };
  return logos[platform] || '';
};

// Get platform color
export const getPlatformColor = (platform: string): string => {
  const colors: { [key: string]: string } = {
    amazon: '#FF9900',
    flipkart: '#2874F0',
    myntra: '#FF3F6C',
    ajio: '#C41E3A',
  };
  return colors[platform] || '#000000';
};

// Generate slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
};

// Get category display name
export const getCategoryDisplayName = (category: string): string => {
  const displayNames: { [key: string]: string } = {
    'shirts': 'Shirts',
    'pants': 'Pants',
    'jeans': 'Jeans',
    'trousers': 'Trousers',
    'hoodies': 'Hoodies',
    'oversized-tshirts': 'Oversized T-Shirts',
  };
  return displayNames[category] || category;
};

// Get price range display
export const getPriceRangeDisplay = (range: string): string => {
  const displays: { [key: string]: string } = {
    'under-1000': 'Under ₹1,000',
    'under-1500': 'Under ₹1,500',
    'under-2000': 'Under ₹2,000',
  };
  return displays[range] || range;
};

// Check if product is new (within 7 days)
export const isNewProduct = (createdAt: any): boolean => {
  const created = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return created > weekAgo;
};

// Get rating stars
export const getRatingStars = (rating: number): string => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  return '★'.repeat(fullStars) + (hasHalfStar ? '½' : '') + '☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0));
};

// Share product
export const shareProduct = async (product: Product): Promise<void> => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href,
      });
    } catch (error) {
      console.log('Share cancelled');
    }
  } else {
    // Fallback: Copy to clipboard
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  }
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Local storage helpers
export const storage = {
  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  get: (key: string): any => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
};
