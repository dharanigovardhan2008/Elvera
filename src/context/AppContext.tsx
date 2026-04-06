import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface AppState {
  user: any | null;
  favorites: string[];
  bag: string[];
  clicks: any[];
}

interface AppContextType extends AppState {
  login: (userData: any) => void;
  logout: () => void;
  toggleFavorite: (productId: string) => void;
  toggleBag: (productId: string) => void;
  trackClick: (productId: string, platform: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('elvera_state');
    return saved ? JSON.parse(saved) : { user: null, favorites: [], bag: [], clicks: [] };
  });

  useEffect(() => {
    localStorage.setItem('elvera_state', JSON.stringify(state));
  }, [state]);

  const login = (userData: any) => {
    setState(s => ({ ...s, user: userData }));
    toast.success('Welcome back to Elvera.');
  };

  const logout = () => {
    setState(s => ({ ...s, user: null }));
    toast.success('Successfully logged out.');
  };

  const toggleFavorite = (productId: string) => {
    setState(s => {
      const isFav = s.favorites.includes(productId);
      if (isFav) {
        toast.success('Removed from favorites.');
        return { ...s, favorites: s.favorites.filter(id => id !== productId) };
      } else {
        toast.success('Added to favorites.');
        return { ...s, favorites: [...s.favorites, productId] };
      }
    });
  };

  const toggleBag = (productId: string) => {
    setState(s => {
      const inBag = s.bag.includes(productId);
      if (inBag) {
        toast.success('Removed from bag.');
        return { ...s, bag: s.bag.filter(id => id !== productId) };
      } else {
        toast.success('Added to bag.');
        return { ...s, bag: [...s.bag, productId] };
      }
    });
  };

  const trackClick = (productId: string, platform: string) => {
    setState(s => ({
      ...s,
      clicks: [...s.clicks, { productId, platform, timestamp: new Date().toISOString() }]
    }));
  };

  return (
    <AppContext.Provider value={{ ...state, login, logout, toggleFavorite, toggleBag, trackClick }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};
