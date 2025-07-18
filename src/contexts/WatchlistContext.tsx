
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

export interface Watchlist {
  id: string;
  name: string;
  items: CarouselItem[];
  isDeletable: boolean;
}

interface WatchlistContextType {
  lists: Watchlist[];
  loading: boolean;
  createList: (name: string) => Promise<Watchlist>;
  deleteList: (listId: string) => void;
  addItemToLists: (item: CarouselItem, listIds: string[]) => void;
  removeItemFromList: (item: CarouselItem, listId: string) => void;
  getListsForItem: (item: CarouselItem) => Watchlist[];
}

const LISTS_KEY = 'moviebase_lists';

const WatchlistContext = createContext<WatchlistContextType | undefined>(
  undefined
);

const DEFAULT_LISTS: Watchlist[] = [
  { id: 'default-watchlist', name: 'My Watchlist', items: [], isDeletable: false },
  { id: 'default-watched', name: 'Watched', items: [], isDeletable: false },
];

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [lists, setLists] = useState<Watchlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      const storedLists = localStorage.getItem(LISTS_KEY);
      if (storedLists) {
        const parsed = JSON.parse(storedLists) as Watchlist[];
        // Ensure default lists exist and are not deletable
        const finalLists = [...DEFAULT_LISTS];
        const storedCustomLists = parsed.filter(l => l.id !== 'default-watchlist' && l.id !== 'default-watched');
        
        const defaultWatchlist = parsed.find(l => l.id === 'default-watchlist');
        if (defaultWatchlist) finalLists[0].items = defaultWatchlist.items;

        const defaultWatched = parsed.find(l => l.id === 'default-watched');
        if (defaultWatched) finalLists[1].items = defaultWatched.items;

        setLists([...finalLists, ...storedCustomLists]);

      } else {
        setLists(DEFAULT_LISTS);
      }
    } catch (error) {
      console.error("Failed to parse lists from localStorage", error);
      setLists(DEFAULT_LISTS);
    }
    setLoading(false);
  }, []);

  const updateLocalStorage = useCallback((newLists: Watchlist[]) => {
    localStorage.setItem(LISTS_KEY, JSON.stringify(newLists));
    setLists(newLists);
  }, []);

  const createList = useCallback((name: string) => {
    return new Promise<Watchlist>((resolve, reject) => {
        setLists(prevLists => {
            if (prevLists.some(list => list.name.toLowerCase() === name.toLowerCase())) {
                reject(new Error("List name already exists"));
                return prevLists;
            }
            const newList: Watchlist = {
                id: crypto.randomUUID(),
                name,
                items: [],
                isDeletable: true,
            };
            const newLists = [...prevLists, newList];
            updateLocalStorage(newLists);
            resolve(newList);
            return newLists;
        });
    });
  }, [updateLocalStorage]);

  const deleteList = useCallback((listId: string) => {
    const newLists = lists.filter(list => list.id !== listId || !list.isDeletable);
    updateLocalStorage(newLists);
  }, [lists, updateLocalStorage]);

  const addItemToLists = useCallback((item: CarouselItem, listIds: string[]) => {
    const newLists = lists.map(list => {
      const isInList = list.items.some(i => i.id === item.id && i.media_type === item.media_type);
      const shouldBeInList = listIds.includes(list.id);

      if (shouldBeInList && !isInList) {
        // Add item
        return { ...list, items: [...list.items, item] };
      }
      if (!shouldBeInList && isInList) {
        // Remove item
        return { ...list, items: list.items.filter(i => !(i.id === item.id && i.media_type === item.media_type)) };
      }
      return list;
    });
    updateLocalStorage(newLists);
  }, [lists, updateLocalStorage]);

  const removeItemFromList = useCallback((item: CarouselItem, listId: string) => {
      const newLists = lists.map(list => {
          if (list.id === listId) {
              return {
                  ...list,
                  items: list.items.filter(i => !(i.id === item.id && i.media_type === item.media_type))
              };
          }
          return list;
      });
      updateLocalStorage(newLists);
  }, [lists, updateLocalStorage]);

  const getListsForItem = useCallback((item: CarouselItem) => {
    return lists.filter(list => list.items.some(i => i.id === item.id && i.media_type === item.media_type));
  }, [lists]);


  return (
    <WatchlistContext.Provider value={{ lists, loading, createList, deleteList, addItemToLists, removeItemFromList, getListsForItem }}>
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
