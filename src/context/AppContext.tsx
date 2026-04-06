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
  toggleFavorite: (productId: string) => Promise<void>;
  toggleBag: (productId: string) => Promise<void>;
  trackClick: (productId: string, productTitle: string, platform: string) => void;
  refreshUserData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthContext(); // Get Firebase user from AuthContext

  const [state, setState] = useState<AppState>(() => {
    // Load from localStorage (for guests or before Firebase loads)
    const saved = localStorage.getItem('elvera_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          favorites: parsed.favorites || [],
          bag: parsed.bag || [],
          clicks: parsed.clicks || [],
          loading: false,
        };
      } catch {
        return { favorites: [], bag: [], clicks: [], loading: false };
      }
    }
    return { favorites: [], bag: [], clicks: [], loading: false };
  });

  // Sync with Firebase when user logs in
  useEffect(() => {
    if (user) {
      loadUserDataFromFirebase();
    } else {
      // User logged out - keep localStorage data (guest mode)
      setState((s) => ({ ...s, loading: false }));
    }
  }, [user]);

  // Save to localStorage whenever state changes (for guests)
  useEffect(() => {
    localStorage.setItem('elvera_state', JSON.stringify(state));
  }, [state]);

  const loadUserDataFromFirebase = async () => {
    if (!user) return;

    try {
      setState((s) => ({ ...s, loading: true }));

      const userData = await userService.getUserData(user.uid);

      if (userData) {
        setState({
          favorites: userData.favorites || [],
          bag: userData.cart?.map((item) => item.productId) || [],
          clicks: state.clicks, // Keep local clicks
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
    const isFav = state.favorites.includes(productId);

    // Optimistic update (works for guests too)
    setState((s) => ({
      ...s,
      favorites: isFav
        ? s.favorites.filter((id) => id !== productId)
        : [...s.favorites, productId],
    }));

    toast.success(isFav ? 'Removed from favorites.' : 'Added to favorites.');

    // If user is logged in, sync to Firebase
    if (user) {
      try {
        await userService.toggleFavorite(user.uid, productId);
      } catch (error) {
        console.error('Error syncing favorite to Firebase:', error);
        // Revert on error
        setState((s) => ({
          ...s,
          favorites: isFav
            ? [...s.favorites, productId]
            : s.favorites.filter((id) => id !== productId),
        }));
        toast.error('Failed to sync. Please try again.');
      }
    }
  };

  const toggleBag = async (productId: string) => {
    const inBag = state.bag.includes(productId);

    // Optimistic update
    setState((s) => ({
      ...s,
      bag: inBag ? s.bag.filter((id) => id !== productId) : [...s.bag, productId],
    }));

    toast.success(inBag ? 'Removed from bag.' : 'Added to bag.');

    // If user is logged in, sync to Firebase
    if (user) {
      try {
        if (inBag) {
          await userService.removeFromCart(user.uid, productId);
        } else {
          await userService.addToCart(user.uid, productId, 1);
        }
      } catch (error) {
        console.error('Error syncing bag to Firebase:', error);
        // Revert on error
        setState((s) => ({
          ...s,
          bag: inBag ? [...s.bag, productId] : s.bag.filter((id) => id !== productId),
        }));
        toast.error('Failed to sync. Please try again.');
      }
    }
  };

  const trackClick = (productId: string, productTitle: string, platform: string) => {
    // Track locally
    setState((s) => ({
      ...s,
      clicks: [
        ...s.clicks,
        { productId, platform, timestamp: new Date().toISOString() },
      ],
    }));

    // Track in Firebase (async, no await)
    if (user) {
      analyticsService.trackClick(productId, productTitle, platform, user.uid);
    } else {
      analyticsService.trackClick(productId, productTitle, platform, null);
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
