import { useState, useEffect } from 'react';
import { userService } from '@/lib/firebase/user';
import { productsService } from '@/lib/firebase/products';
import { Product } from '@/lib/firebase/schema';
import { useAuth } from './useAuth';

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
      setFavoriteProducts([]);
      setLoading(false);
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const favoriteIds = await userService.getFavorites(user.uid);
      setFavorites(favoriteIds);

      // Fetch full product details
      const products = await Promise.all(
        favoriteIds.map((id) => productsService.getProductById(id))
      );
      setFavoriteProducts(products.filter((p) => p !== null) as Product[]);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (productId: string) => {
    if (!user) {
      throw new Error('Please login to add favorites');
    }

    try {
      const success = await userService.addToFavorites(user.uid, productId);
      if (success) {
        await fetchFavorites();
      }
      return success;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  };

  const removeFromFavorites = async (productId: string) => {
    if (!user) return false;

    try {
      const success = await userService.removeFromFavorites(user.uid, productId);
      if (success) {
        await fetchFavorites();
      }
      return success;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
  };

  const toggleFavorite = async (productId: string) => {
    if (!user) {
      throw new Error('Please login to add favorites');
    }

    try {
      const success = await userService.toggleFavorite(user.uid, productId);
      if (success) {
        await fetchFavorites();
      }
      return success;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return false;
    }
  };

  const isFavorited = (productId: string) => {
    return favorites.includes(productId);
  };

  return {
    favorites,
    favoriteProducts,
    loading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorited,
    refreshFavorites: fetchFavorites,
  };
};
