
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
  addItems: (items: CarouselItem[]) => void; // For bulk import
  watchlist: CarouselItem[]; // For backward compatibility with import page
}

const LISTS_KEY = 'moviebase_lists';
const OLD_WATCHLIST_KEY = 'watchlist'; // Key for the old single watchlist
const OLD_WATCHED_KEY = 'watched'; // Key for the old single watched list

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
      const storedListsRaw = localStorage.getItem(LISTS_KEY);
      
      if (storedListsRaw) {
        const parsed = JSON.parse(storedListsRaw) as Watchlist[];
        // Ensure default lists exist and are not deletable
        const finalLists = [...DEFAULT_LISTS.map(l => ({...l}))]; // Deep copy
        const storedCustomLists = parsed.filter(l => l.id !== 'default-watchlist' && l.id !== 'default-watched');
        
        const defaultWatchlist = parsed.find(l => l.id === 'default-watchlist');
        if (defaultWatchlist) finalLists[0].items = defaultWatchlist.items;

        const defaultWatched = parsed.find(l => l.id === 'default-watched');
        if (defaultWatched) finalLists[1].items = defaultWatched.items;

        setLists([...finalLists, ...storedCustomLists]);
      } else {
        // Migration logic from old format
        const oldWatchlistRaw = localStorage.getItem(OLD_WATCHLIST_KEY);
        const oldWatchedRaw = localStorage.getItem(OLD_WATCHED_KEY);
        
        const newLists = [...DEFAULT_LISTS.map(l => ({...l}))]; // Deep copy
        let migrated = false;

        if (oldWatchlistRaw) {
          newLists[0].items = JSON.parse(oldWatchlistRaw);
          localStorage.removeItem(OLD_WATCHLIST_KEY);
          migrated = true;
        }
        if (oldWatchedRaw) {
          newLists[1].items = JSON.parse(oldWatchedRaw);
          localStorage.removeItem(OLD_WATCHED_KEY);
          migrated = true;
        }

        if (migrated) {
          localStorage.setItem(LISTS_KEY, JSON.stringify(newLists));
        }
        setLists(newLists);
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

  const addItems = useCallback((itemsToAdd: CarouselItem[]) => {
    const newLists = [...lists];
    const mainWatchlist = newLists.find(l => l.id === 'default-watchlist');
    if (mainWatchlist) {
        const existingItemIds = new Set(mainWatchlist.items.map(i => `${i.media_type}-${i.id}`));
        const itemsToActuallyAdd = itemsToAdd.filter(item => !existingItemIds.has(`${item.media_type}-${item.id}`));
        mainWatchlist.items.push(...itemsToActuallyAdd);
    }
    updateLocalStorage(newLists);
  }, [lists, updateLocalStorage]);

  return (
    <WatchlistContext.Provider value={{ lists, loading, createList, deleteList, addItemToLists, addItems, watchlist: lists.find(l => l.id === 'default-watchlist')?.items || [] }}>
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
