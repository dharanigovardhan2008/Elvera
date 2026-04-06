import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  QueryConstraint,
  startAfter,
  Query,
  DocumentData,
} from 'firebase/firestore';
import { db } from './config';
import { Product, ProductFilters } from './schema';

const productsCollection = collection(db, 'products');

export const productsService = {
  // Get all products
  async getAllProducts(): Promise<Product[]> {
    try {
      const snapshot = await getDocs(productsCollection);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
    } catch (error) {
      console.error('Error getting products:', error);
      return [];
    }
  },

  // Get product by ID
  async getProductById(id: string): Promise<Product | null> {
    try {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Product;
      }
      return null;
    } catch (error) {
      console.error('Error getting product:', error);
      return null;
    }
  },

  // Get products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const q = query(productsCollection, where('category', '==', category));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
    } catch (error) {
      console.error('Error getting products by category:', error);
      return [];
    }
  },

  // Get products by price range
  async getProductsByPriceRange(priceRange: string): Promise<Product[]> {
    try {
      const q = query(productsCollection, where('priceRange', '==', priceRange));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
    } catch (error) {
      console.error('Error getting products by price range:', error);
      return [];
    }
  },

  // Get products by platform
  async getProductsByPlatform(platform: string): Promise<Product[]> {
    try {
      const q = query(productsCollection, where('platform', '==', platform));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
    } catch (error) {
      console.error('Error getting products by platform:', error);
      return [];
    }
  },

  // Get featured products
  async getFeaturedProducts(limitCount: number = 10): Promise<Product[]> {
    try {
      const q = query(
        productsCollection,
        where('featured', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
    } catch (error) {
      console.error('Error getting featured products:', error);
      return [];
    }
  },

  // Get latest products
  async getLatestProducts(limitCount: number = 12): Promise<Product[]> {
    try {
      const q = query(
        productsCollection,
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
    } catch (error) {
      console.error('Error getting latest products:', error);
      return [];
    }
  },

  // Get top rated products
  async getTopRatedProducts(limitCount: number = 10): Promise<Product[]> {
    try {
      const q = query(
        productsCollection,
        where('rating', '>=', 4.0),
        orderBy('rating', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
    } catch (error) {
      console.error('Error getting top rated products:', error);
      return [];
    }
  },

  // Filter products (advanced)
  async filterProducts(filters: ProductFilters): Promise<Product[]> {
    try {
      const constraints: QueryConstraint[] = [];

      if (filters.category) {
        constraints.push(where('category', '==', filters.category));
      }
      if (filters.priceRange) {
        constraints.push(where('priceRange', '==', filters.priceRange));
      }
      if (filters.platform) {
        constraints.push(where('platform', '==', filters.platform));
      }
      if (filters.minRating) {
        constraints.push(where('rating', '>=', filters.minRating));
      }
      if (filters.inStock !== undefined) {
        constraints.push(where('inStock', '==', filters.inStock));
      }
      if (filters.featured !== undefined) {
        constraints.push(where('featured', '==', filters.featured));
      }

      const q = query(productsCollection, ...constraints);
      const snapshot = await getDocs(q);

      let products = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      // Client-side search filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        products = products.filter(
          (product) =>
            product.title.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower) ||
            product.category.toLowerCase().includes(searchLower)
        );
      }

      return products;
    } catch (error) {
      console.error('Error filtering products:', error);
      return [];
    }
  },

  // Search products
  async searchProducts(searchTerm: string): Promise<Product[]> {
    try {
      const allProducts = await this.getAllProducts();
      const lowercaseSearch = searchTerm.toLowerCase();

      return allProducts.filter(
        (product) =>
          product.title.toLowerCase().includes(lowercaseSearch) ||
          product.description.toLowerCase().includes(lowercaseSearch) ||
          product.category.toLowerCase().includes(lowercaseSearch)
      );
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  },

  // Add product (Admin only)
  async addProduct(
    product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string | null> {
    try {
      const docRef = await addDoc(productsCollection, {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding product:', error);
      return null;
    }
  },

  // Update product (Admin only)
  async updateProduct(id: string, updates: Partial<Product>): Promise<boolean> {
    try {
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      return false;
    }
  },

  // Delete product (Admin only)
  async deleteProduct(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'products', id));
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  },

  // Get products count
  async getProductsCount(): Promise<number> {
    try {
      const snapshot = await getDocs(productsCollection);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting products count:', error);
      return 0;
    }
  },

  // Get products with pagination
  async getProductsWithPagination(
    limitCount: number = 12,
    lastDoc?: any
  ): Promise<{ products: Product[]; lastDoc: any }> {
    try {
      let q;
      if (lastDoc) {
        q = query(
          productsCollection,
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(limitCount)
        );
      } else {
        q = query(
          productsCollection,
          orderBy('createdAt', 'desc'),
          limit(limitCount)
        );
      }

      const snapshot = await getDocs(q);
      const products = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      const lastVisible = snapshot.docs[snapshot.docs.length - 1];

      return { products, lastDoc: lastVisible };
    } catch (error) {
      console.error('Error getting products with pagination:', error);
      return { products: [], lastDoc: null };
    }
  },
};
