
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
  addItems: (items: CarouselItem[]) => void;
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
        // Ensure no duplicates are loaded from localStorage initially
        const parsed = JSON.parse(storedWatchlist) as CarouselItem[];
        const uniqueItems: CarouselItem[] = [];
        const seen = new Set<string>();
        for (const item of parsed) {
            const key = `${item.media_type}-${item.id}`;
            if (!seen.has(key)) {
                uniqueItems.push(item);
                seen.add(key);
            }
        }
        setWatchlist(uniqueItems);
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
    setWatchlist((prevWatchlist) => {
      // Prevent adding duplicates
      if (prevWatchlist.some(i => i.id === item.id && i.media_type === item.media_type)) {
        return prevWatchlist; // Item already in watchlist
      }
      const newWatchlist = [...prevWatchlist, item];
      updateLocalStorage(newWatchlist);
      return newWatchlist;
    });
  };

  const addItems = (items: CarouselItem[]) => {
    setWatchlist((prevWatchlist) => {
      const newItems: CarouselItem[] = [];
      const existingIds = new Set(prevWatchlist.map(i => `${i.media_type}-${i.id}`));
      
      for (const item of items) {
        const uniqueId = `${item.media_type}-${item.id}`;
        if (!existingIds.has(uniqueId)) {
          newItems.push(item);
          existingIds.add(uniqueId);
        }
      }
      
      if (newItems.length === 0) {
        return prevWatchlist;
      }

      const newWatchlist = [...prevWatchlist, ...newItems];
      updateLocalStorage(newWatchlist);
      return newWatchlist;
    });
  };

  const removeItem = (id: number, media_type: 'movie' | 'tv') => {
    setWatchlist((prevWatchlist) => {
      const newWatchlist = prevWatchlist.filter(
        (item) => !(item.id === id && item.media_type === media_type)
      );
      updateLocalStorage(newWatchlist);
      return newWatchlist;
    });
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addItem, addItems, removeItem, loading }}>
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
