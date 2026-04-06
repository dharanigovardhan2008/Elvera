// Re-export all types from schema
export type {
  User,
  CartItem,
  Product,
  Combo,
  ComboItem,
  ClickAnalytics,
  AdminUser,
  CategoryType,
  PriceRangeType,
  PlatformType,
  ProductFilters,
  CloudinaryImage,
} from '@/lib/firebase/schema';

// Additional UI types
export interface FilterOptions {
  categories: CategoryType[];
  priceRanges: PriceRangeType[];
  platforms: PlatformType[];
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface ProductCardProps {
  product: Product;
  onFavoriteClick?: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
  showQuickView?: boolean;
}

export interface ComboCardProps {
  combo: Combo;
  onClick?: (comboId: string) => void;
}
