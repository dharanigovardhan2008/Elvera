import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuthContext } from './AuthContext';
import { userService } from '@/lib/firebase/user';
import { analyticsService } from '@/lib/firebase/analytics';

interface AppState {
  favorites: string[];
  bag: string[];
  clicks: any[];
  loading: boolean;
}

interface AppContextType extends AppState {
  toggleFavorite: (productId: string, requireLogin?: boolean) => Promise<boolean>;
  toggleBag: (productId: string, requireLogin?: boolean) => Promise<boolean>;
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

  useEffect(() => {
    if (user) {
      loadUserDataFromFirebase();
    } else {
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
      console.log('APP CONTEXT USER DATA:', userData);

      if (userData) {
        setState({
          favorites: userData.favorites || [],
          bag: userData.cart?.map((item: any) => item.productId) || [],
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

  const toggleFavorite = async (
    productId: string,
    requireLogin: boolean = true
  ): Promise<boolean> => {
    if (requireLogin && !user) {
      toast.error('Please login to add favorites');
      return false;
    }

    if (!user) {
      return false;
    }

    const isFav = state.favorites.includes(productId);

    setState((s) => ({
      ...s,
      favorites: isFav
        ? s.favorites.filter((id) => id !== productId)
        : [...s.favorites, productId],
    }));

    toast.success(isFav ? 'Removed from favorites.' : 'Added to favorites.');

    try {
      await userService.toggleFavorite(user.uid, productId);
      return true;
    } catch (error) {
      console.error('Error syncing favorite:', error);

      setState((s) => ({
        ...s,
        favorites: isFav
          ? [...s.favorites, productId]
          : s.favorites.filter((id) => id !== productId),
      }));

      toast.error('Failed to sync. Please try again.');
      return false;
    }
  };

  const toggleBag = async (
    productId: string,
    requireLogin: boolean = true
  ): Promise<boolean> => {
    if (requireLogin && !user) {
      toast.error('Please login to add items to bag');
      return false;
    }

    if (!user) {
      return false;
    }

    const inBag = state.bag.includes(productId);

    setState((s) => ({
      ...s,
      bag: inBag ? s.bag.filter((id) => id !== productId) : [...s.bag, productId],
    }));

    toast.success(inBag ? 'Removed from bag.' : 'Added to bag.');

    try {
      if (inBag) {
        await userService.removeFromCart(user.uid, productId);
      } else {
        await userService.addToCart(user.uid, productId, 1);
      }
      return true;
    } catch (error) {
      console.error('Error syncing bag:', error);

      setState((s) => ({
        ...s,
        bag: inBag ? [...s.bag, productId] : s.bag.filter((id) => id !== productId),
      }));

      toast.error('Failed to sync. Please try again.');
      return false;
    }
  };

  const trackClick = (
    productId: string,
    productTitle: string,
    platform: string
  ) => {
    setState((s) => ({
      ...s,
      clicks: [
        ...s.clicks,
        { productId, productTitle, platform, timestamp: new Date().toISOString() },
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
