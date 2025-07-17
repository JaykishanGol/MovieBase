'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { CarouselItem } from '@/types';
import { useAuth } from './AuthContext';

interface WatchlistContextType {
  watchlist: CarouselItem[];
  addItem: (item: CarouselItem) => void;
  removeItem: (id: number, media_type: 'movie' | 'tv') => void;
  loading: boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(
  undefined
);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);

  const getWatchlistKey = useCallback(() => {
    return user ? `watchlist_${user.uid}` : 'watchlist_guest';
  }, [user]);

  useEffect(() => {
    setLoading(true);
    try {
      const storedWatchlist = localStorage.getItem(getWatchlistKey());
      if (storedWatchlist) {
        setWatchlist(JSON.parse(storedWatchlist));
      } else {
        setWatchlist([]);
      }
    } catch (error) {
      console.error("Failed to parse watchlist from localStorage", error);
      setWatchlist([]);
    }
    setLoading(false);
  }, [user, getWatchlistKey]);

  const updateLocalStorage = (newWatchlist: CarouselItem[]) => {
     localStorage.setItem(getWatchlistKey(), JSON.stringify(newWatchlist));
  }

  const addItem = (item: CarouselItem) => {
    const newWatchlist = [...watchlist, item];
    setWatchlist(newWatchlist);
    updateLocalStorage(newWatchlist);
  };

  const removeItem = (id: number, media_type: 'movie' | 'tv') => {
    const newWatchlist = watchlist.filter(
      (item) => !(item.id === id && item.media_type === media_type)
    );
    setWatchlist(newWatchlist);
    updateLocalStorage(newWatchlist);
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addItem, removeItem, loading }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}
