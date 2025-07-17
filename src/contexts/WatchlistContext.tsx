'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { CarouselItem } from '@/types';

interface WatchlistContextType {
  watchlist: CarouselItem[];
  addItem: (item: CarouselItem) => void;
  removeItem: (id: number, media_type: 'movie' | 'tv') => void;
  loading: boolean;
}

const WATCHLIST_KEY = 'watchlist';

const WatchlistContext = createContext<WatchlistContextType | undefined>(
  undefined
);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      const storedWatchlist = localStorage.getItem(WATCHLIST_KEY);
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
  }, []);

  const updateLocalStorage = (newWatchlist: CarouselItem[]) => {
     localStorage.setItem(WATCHLIST_KEY, JSON.stringify(newWatchlist));
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
