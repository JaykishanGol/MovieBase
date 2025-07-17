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
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(
  undefined
);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<CarouselItem[]>([]);

  useEffect(() => {
    try {
      const storedWatchlist = localStorage.getItem('watchlist');
      if (storedWatchlist) {
        setWatchlist(JSON.parse(storedWatchlist));
      }
    } catch (error) {
      console.error('Failed to parse watchlist from localStorage', error);
      setWatchlist([]);
    }
  }, []);

  const updateWatchlist = (newWatchlist: CarouselItem[]) => {
    setWatchlist(newWatchlist);
    try {
      localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
    } catch (error) {
      console.error('Failed to save watchlist to localStorage', error);
    }
  };

  const addItem = (item: CarouselItem) => {
    const itemExists = watchlist.some(
      (i) => i.id === item.id && i.media_type === item.media_type
    );
    if (!itemExists) {
      updateWatchlist([...watchlist, item]);
    }
  };

  const removeItem = (id: number, media_type: 'movie' | 'tv') => {
    const newWatchlist = watchlist.filter(
      (item) => !(item.id === id && item.media_type === media_type)
    );
    updateWatchlist(newWatchlist);
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addItem, removeItem }}>
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
