
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { CarouselItem } from '@/types';

interface WatchedContextType {
  watched: CarouselItem[];
  addItem: (item: CarouselItem) => void;
  addItems: (items: CarouselItem[]) => void;
  removeItem: (id: number, media_type: 'movie' | 'tv') => void;
  loading: boolean;
}

const WATCHED_KEY = 'watched_list';

const WatchedContext = createContext<WatchedContextType | undefined>(
  undefined
);

export function WatchedProvider({ children }: { children: ReactNode }) {
  const [watched, setWatched] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      const storedWatched = localStorage.getItem(WATCHED_KEY);
      if (storedWatched) {
        const parsed = JSON.parse(storedWatched) as CarouselItem[];
        const uniqueItems: CarouselItem[] = [];
        const seen = new Set<string>();
        for (const item of parsed) {
            const key = `${item.media_type}-${item.id}`;
            if (!seen.has(key)) {
                uniqueItems.push(item);
                seen.add(key);
            }
        }
        setWatched(uniqueItems);
      } else {
        setWatched([]);
      }
    } catch (error) {
      console.error("Failed to parse watched list from localStorage", error);
      setWatched([]);
    }
    setLoading(false);
  }, []);

  const updateLocalStorage = (newWatched: CarouselItem[]) => {
     localStorage.setItem(WATCHED_KEY, JSON.stringify(newWatched));
  }

  const addItem = (item: CarouselItem) => {
    setWatched((prevWatched) => {
      if (prevWatched.some(i => i.id === item.id && i.media_type === item.media_type)) {
        return prevWatched;
      }
      const newWatched = [...prevWatched, item];
      updateLocalStorage(newWatched);
      return newWatched;
    });
  };

  const addItems = (items: CarouselItem[]) => {
    setWatched((prevWatched) => {
      const newItems: CarouselItem[] = [];
      const existingIds = new Set(prevWatched.map(i => `${i.media_type}-${i.id}`));
      
      for (const item of items) {
        const uniqueId = `${item.media_type}-${item.id}`;
        if (!existingIds.has(uniqueId)) {
          newItems.push(item);
          existingIds.add(uniqueId);
        }
      }
      
      if (newItems.length === 0) {
        return prevWatched;
      }

      const newWatched = [...prevWatched, ...newItems];
      updateLocalStorage(newWatched);
      return newWatched;
    });
  };

  const removeItem = (id: number, media_type: 'movie' | 'tv') => {
    setWatched((prevWatched) => {
      const newWatched = prevWatched.filter(
        (item) => !(item.id === id && item.media_type === media_type)
      );
      updateLocalStorage(newWatched);
      return newWatched;
    });
  };

  return (
    <WatchedContext.Provider value={{ watched, addItem, addItems, removeItem, loading }}>
      {children}
    </WatchedContext.Provider>
  );
}

export function useWatched() {
  const context = useContext(WatchedContext);
  if (context === undefined) {
    throw new Error('useWatched must be used within a WatchedProvider');
  }
  return context;
}
