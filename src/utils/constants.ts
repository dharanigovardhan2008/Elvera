export const CATEGORIES = [
  { value: 'shirts', label: 'Shirts' },
  { value: 'pants', label: 'Pants' },
  { value: 'jeans', label: 'Jeans' },
  { value: 'trousers', label: 'Trousers' },
  { value: 'hoodies', label: 'Hoodies' },
  { value: 'oversized-tshirts', label: 'Oversized T-Shirts' },
];

export const PRICE_RANGES = [
  { value: 'under-1000', label: 'Under ₹1,000', max: 1000 },
  { value: 'under-1500', label: 'Under ₹1,500', max: 1500 },
  { value: 'under-2000', label: 'Under ₹2,000', max: 2000 },
];

export const COMBO_PRICE_RANGES = [
  { value: 'under-1500', label: 'Under ₹1,500', max: 1500 },
  { value: 'under-2000', label: 'Under ₹2,000', max: 2000 },
];

export const PLATFORMS = [
  { value: 'amazon', label: 'Amazon', color: '#FF9900' },
  { value: 'flipkart', label: 'Flipkart', color: '#2874F0' },
  { value: 'myntra', label: 'Myntra', color: '#FF3F6C' },
  { value: 'ajio', label: 'Ajio', color: '#C41E3A' },
];

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

export const COLORS = [
  'Black',
  'White',
  'Navy',
  'Grey',
  'Beige',
  'Brown',
  'Green',
  'Blue',
  'Red',
  'Yellow',
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Popular' },
];

export const ITEMS_PER_PAGE = 12;

export const ADMIN_PERMISSIONS = [
  'manage_products',
  'manage_combos',
  'view_analytics',
  'manage_users',
];

export const CLOUDINARY_FOLDERS = {
  PRODUCTS: 'products',
  COMBOS: 'combos',
  BANNERS: 'banners',
} as const;

export const IMAGE_MAX_SIZE = 10 * 1024 * 1024; // 10MB
export const IMAGE_ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const ROUTES = {
  HOME: '/',
  SHOP: '/shop',
  COMBOS: '/combos',
  PRODUCT_DETAIL: '/product',
  COMBO_DETAIL: '/combo',
  LOGIN: '/login',
  SIGNUP: '/signup',
  PROFILE: '/profile',
  FAVORITES: '/favorites',
  CART: '/bag',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_COMBOS: '/admin/combos',
  ADMIN_ANALYTICS: '/admin/analytics',
} as const;
