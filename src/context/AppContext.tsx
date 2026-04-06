import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuthContext } from './AuthContext';
import { userService } from '@/lib/firebase/user';
import { analyticsService } from '@/lib/firebase/analytics';
import { useNavigate } from 'react-router-dom';

interface AppState {
  favorites: string[];
  bag: string[];
  clicks: any[];
  loading: boolean;
}

interface AppContextType extends AppState {
  toggleFavorite: (productId: string) => Promise<void>;
  toggleBag: (productId: string) => Promise<void>;
  trackClick: (productId: string, productTitle: string, platform: string) => void;
  refreshUserData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthContext();

  const [state, setState] = useState<AppState>({
    favorites: [],
    bag: [],
    clicks: [],
    loading: false,
  });

  // Load user data from Firebase when user logs in
  useEffect(() => {
    if (user) {
      loadUserDataFromFirebase();
    } else {
      // Clear state when user logs out
      setState({
        favorites: [],
        bag: [],
        clicks: [],
        loading: false,
      });
    }
  }, [user]);

  const loadUserDataFromFirebase = async () => {
    if (!user) return;

    try {
      setState((s) => ({ ...s, loading: true }));

      const userData = await userService.getUserData(user.uid);

      if (userData) {
        setState({
          favorites: userData.favorites || [],
          bag: userData.cart?.map((item) => item.productId) || [],
          clicks: [],
          loading: false,
        });
      } else {
        setState((s) => ({ ...s, loading: false }));
      }
    } catch (error) {
      console.error('Error loading Firebase user data:', error);
      setState((s) => ({ ...s, loading: false }));
    }
  };

  const refreshUserData = async () => {
    if (user) {
      await loadUserDataFromFirebase();
    }
  };

  const toggleFavorite = async (productId: string) => {
    // ✅ REQUIRE LOGIN
    if (!user) {
      toast.error('Please login to add favorites');
      // Don't redirect here - let ProductCard handle it
      throw new Error('LOGIN_REQUIRED');
    }

    const isFav = state.favorites.includes(productId);

    // Optimistic update
    setState((s) => ({
      ...s,
      favorites: isFav
        ? s.favorites.filter((id) => id !== productId)
        : [...s.favorites, productId],
    }));

    toast.success(isFav ? 'Removed from favorites.' : 'Added to favorites.');

    // Sync to Firebase
    try {
      await userService.toggleFavorite(user.uid, productId);
    } catch (error) {
      console.error('Error syncing favorite:', error);
      // Revert on error
      setState((s) => ({
        ...s,
        favorites: isFav
          ? [...s.favorites, productId]
          : s.favorites.filter((id) => id !== productId),
      }));
      toast.error('Failed to sync. Please try again.');
    }
  };

  const toggleBag = async (productId: string) => {
    // ✅ REQUIRE LOGIN
    if (!user) {
      toast.error('Please login to add items to bag');
      // Don't redirect here - let ProductCard handle it
      throw new Error('LOGIN_REQUIRED');
    }

    const inBag = state.bag.includes(productId);

    // Optimistic update
    setState((s) => ({
      ...s,
      bag: inBag ? s.bag.filter((id) => id !== productId) : [...s.bag, productId],
    }));

    toast.success(inBag ? 'Removed from bag.' : 'Added to bag.');

    // Sync to Firebase
    try {
      if (inBag) {
        await userService.removeFromCart(user.uid, productId);
      } else {
        await userService.addToCart(user.uid, productId, 1);
      }
    } catch (error) {
      console.error('Error syncing bag:', error);
      // Revert on error
      setState((s) => ({
        ...s,
        bag: inBag ? [...s.bag, productId] : s.bag.filter((id) => id !== productId),
      }));
      toast.error('Failed to sync. Please try again.');
    }
  };

  const trackClick = (productId: string, productTitle: string, platform: string) => {
    // ✅ ALLOW GUESTS TO TRACK CLICKS (for analytics)
    setState((s) => ({
      ...s,
      clicks: [
        ...s.clicks,
        { productId, platform, timestamp: new Date().toISOString() },
      ],
    }));

    try {
      analyticsService.trackClick(productId, productTitle, platform, user?.uid || null);
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        toggleFavorite,
        toggleBag,
        trackClick,
        refreshUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
