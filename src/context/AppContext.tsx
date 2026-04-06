import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuthContext } from './AuthContext';
import { userService } from '@/lib/firebase/user';
import { analyticsService } from '@/lib/firebase/analytics';

interface AppState {
  favorites: string[];
  bag: string[];
  loading: boolean;
}

interface AppContextType extends AppState {
  toggleFavorite: (productId: string) => Promise<void>;
  toggleBag: (productId: string) => Promise<void>;
  trackClick: (productId: string, productTitle: string, platform: string) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthContext(); // Get Firebase user
  const [state, setState] = useState<AppState>({
    favorites: [],
    bag: [],
    loading: true,
  });

  // Load user data from Firebase when user logs in
  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      // User logged out - clear state
      setState({ favorites: [], bag: [], loading: false });
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setState(s => ({ ...s, loading: true }));

      const userData = await userService.getUserData(user.uid);
      
      if (userData) {
        setState({
          favorites: userData.favorites || [],
          bag: userData.cart?.map(item => item.productId) || [],
          loading: false,
        });
      } else {
        setState({ favorites: [], bag: [], loading: false });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setState({ favorites: [], bag: [], loading: false });
    }
  };

  const refreshUserData = async () => {
    await loadUserData();
  };

  const toggleFavorite = async (productId: string) => {
    if (!user) {
      toast.error('Please login to add favorites');
      return;
    }

    try {
      const isFav = state.favorites.includes(productId);

      // Optimistic update
      setState(s => ({
        ...s,
        favorites: isFav
          ? s.favorites.filter(id => id !== productId)
          : [...s.favorites, productId],
      }));

      // Update Firebase
      const success = await userService.toggleFavorite(user.uid, productId);

      if (success) {
        toast.success(isFav ? 'Removed from favorites' : 'Added to favorites');
      } else {
        // Revert on failure
        setState(s => ({
          ...s,
          favorites: isFav
            ? [...s.favorites, productId]
            : s.favorites.filter(id => id !== productId),
        }));
        toast.error('Failed to update favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Something went wrong');
    }
  };

  const toggleBag = async (productId: string) => {
    if (!user) {
      toast.error('Please login to add items to bag');
      return;
    }

    try {
      const inBag = state.bag.includes(productId);

      // Optimistic update
      setState(s => ({
        ...s,
        bag: inBag ? s.bag.filter(id => id !== productId) : [...s.bag, productId],
      }));

      // Update Firebase
      let success = false;
      if (inBag) {
        success = await userService.removeFromCart(user.uid, productId);
      } else {
        success = await userService.addToCart(user.uid, productId, 1);
      }

      if (success) {
        toast.success(inBag ? 'Removed from bag' : 'Added to bag');
      } else {
        // Revert on failure
        setState(s => ({
          ...s,
          bag: inBag ? [...s.bag, productId] : s.bag.filter(id => id !== productId),
        }));
        toast.error('Failed to update bag');
      }
    } catch (error) {
      console.error('Error toggling bag:', error);
      toast.error('Something went wrong');
    }
  };

  const trackClick = async (productId: string, productTitle: string, platform: string) => {
    try {
      await analyticsService.trackClick(
        productId,
        productTitle,
        platform,
        user?.uid || null
      );
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
