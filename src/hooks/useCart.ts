import { useState, useEffect } from 'react';
import { userService } from '@/lib/firebase/user';
import { productsService } from '@/lib/firebase/products';
import { Product, CartItem } from '@/lib/firebase/schema';
import { useAuth } from './useAuth';

interface CartItemWithProduct extends CartItem {
  product: Product | null;
}

export const useCart = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartWithProducts, setCartWithProducts] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart([]);
      setCartWithProducts([]);
      setTotalItems(0);
      setTotalPrice(0);
      setLoading(false);
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const cartItems = await userService.getCart(user.uid);
      setCart(cartItems);

      // Fetch full product details
      const itemsWithProducts = await Promise.all(
        cartItems.map(async (item) => {
          const product = await productsService.getProductById(item.productId);
          return {
            ...item,
            product,
          };
        })
      );

      setCartWithProducts(itemsWithProducts);

      // Calculate totals
      const items = itemsWithProducts.reduce((sum, item) => sum + item.quantity, 0);
      const price = itemsWithProducts.reduce(
        (sum, item) => sum + (item.product?.price || 0) * item.quantity,
        0
      );

      setTotalItems(items);
      setTotalPrice(price);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!user) {
      throw new Error('Please login to add items to cart');
    }

    try {
      const success = await userService.addToCart(user.uid, productId, quantity);
      if (success) {
        await fetchCart();
      }
      return success;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return false;

    try {
      const success = await userService.removeFromCart(user.uid, productId);
      if (success) {
        await fetchCart();
      }
      return success;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) return false;

    try {
      const success = await userService.updateCartQuantity(
        user.uid,
        productId,
        quantity
      );
      if (success) {
        await fetchCart();
      }
      return success;
    } catch (error) {
      console.error('Error updating quantity:', error);
      return false;
    }
  };

  const clearCart = async () => {
    if (!user) return false;

    try {
      const success = await userService.clearCart(user.uid);
      if (success) {
        await fetchCart();
      }
      return success;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  };

  const isInCart = (productId: string) => {
    return cart.some((item) => item.productId === productId);
  };

  const getItemQuantity = (productId: string) => {
    const item = cart.find((item) => item.productId === productId);
    return item?.quantity || 0;
  };

  return {
    cart,
    cartWithProducts,
    loading,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
    refreshCart: fetchCart,
  };
};
