import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { User, CartItem } from './schema';

export const userService = {
  // Get user data
  async getUserData(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data() as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  // Add to favorites
  async addToFavorites(userId: string, productId: string): Promise<boolean> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        favorites: arrayUnion(productId),
      });
      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  },

  // Remove from favorites
  async removeFromFavorites(userId: string, productId: string): Promise<boolean> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        favorites: arrayRemove(productId),
      });
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
  },

  // Toggle favorite
  async toggleFavorite(userId: string, productId: string): Promise<boolean> {
    try {
      const userData = await this.getUserData(userId);
      if (!userData) return false;

      const isFavorite = userData.favorites.includes(productId);

      if (isFavorite) {
        return await this.removeFromFavorites(userId, productId);
      } else {
        return await this.addToFavorites(userId, productId);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return false;
    }
  },

  // Get favorites
  async getFavorites(userId: string): Promise<string[]> {
    try {
      const userData = await this.getUserData(userId);
      return userData?.favorites || [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  },

  // Check if product is favorited
  async isFavorited(userId: string, productId: string): Promise<boolean> {
    try {
      const favorites = await this.getFavorites(userId);
      return favorites.includes(productId);
    } catch (error) {
      console.error('Error checking if favorited:', error);
      return false;
    }
  },

  // Add to cart
  async addToCart(
    userId: string,
    productId: string,
    quantity: number = 1
  ): Promise<boolean> {
    try {
      const userRef = doc(db, 'users', userId);
      const userData = await this.getUserData(userId);

      if (!userData) return false;

      const existingItem = userData.cart.find(
        (item) => item.productId === productId
      );

      let updatedCart;
      if (existingItem) {
        // Update quantity
        updatedCart = userData.cart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        updatedCart = [
          ...userData.cart,
          {
            productId,
            quantity,
            addedAt: serverTimestamp(),
          },
        ];
      }

      await updateDoc(userRef, { cart: updatedCart });
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  },

  // Remove from cart
  async removeFromCart(userId: string, productId: string): Promise<boolean> {
    try {
      const userRef = doc(db, 'users', userId);
      const userData = await this.getUserData(userId);

      if (!userData) return false;

      const updatedCart = userData.cart.filter(
        (item) => item.productId !== productId
      );

      await updateDoc(userRef, { cart: updatedCart });
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  },

  // Update cart quantity
  async updateCartQuantity(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<boolean> {
    try {
      const userRef = doc(db, 'users', userId);
      const userData = await this.getUserData(userId);

      if (!userData) return false;

      if (quantity <= 0) {
        return await this.removeFromCart(userId, productId);
      }

      const updatedCart = userData.cart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );

      await updateDoc(userRef, { cart: updatedCart });
      return true;
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      return false;
    }
  },

  // Get cart
  async getCart(userId: string): Promise<CartItem[]> {
    try {
      const userData = await this.getUserData(userId);
      return userData?.cart || [];
    } catch (error) {
      console.error('Error getting cart:', error);
      return [];
    }
  },

  // Clear cart
  async clearCart(userId: string): Promise<boolean> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { cart: [] });
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  },

  // Get cart count
  async getCartCount(userId: string): Promise<number> {
    try {
      const cart = await this.getCart(userId);
      return cart.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      console.error('Error getting cart count:', error);
      return 0;
    }
  },
};
