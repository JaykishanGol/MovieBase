
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
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Watchlist {
  id: string;
  name: string;
  items: CarouselItem[];
  isDeletable: boolean;
  user_id: string;
}

interface WatchlistContextType {
  lists: Watchlist[];
  loading: boolean;
  createList: (name: string) => Promise<any>;
  deleteList: (listId: string) => void;
  addItemToLists: (item: CarouselItem, listIds: string[]) => void;
  addItems: (items: CarouselItem[]) => void; // For bulk import
  watchlist: CarouselItem[]; // Legacy support for main watchlist
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(
  undefined
);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [lists, setLists] = useState<Watchlist[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLists = useCallback(async () => {
    if (!user) {
      setLists([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data: listsData, error: listsError } = await supabase
      .from('lists')
      .select('id, name, is_deletable, user_id')
      .eq('user_id', user.id);

    if (listsError) {
      console.error('Error fetching lists:', listsError);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch your lists.' });
      setLoading(false);
      return;
    }
    
    // Ensure default lists exist
    let hasWatchlist = listsData.some(l => l.name === 'My Watchlist');
    let hasWatched = listsData.some(l => l.name === 'Watched');
    let finalListsData = [...listsData];

    if (!hasWatchlist) {
        const { data, error } = await supabase.from('lists').insert({ name: 'My Watchlist', user_id: user.id, is_deletable: false }).select().single();
        if(error) { console.error(error); }
        else if(data) { finalListsData.push({ id: data.id, name: data.name, is_deletable: data.is_deletable, user_id: data.user_id }); }
    }
     if (!hasWatched) {
        const { data, error } = await supabase.from('lists').insert({ name: 'Watched', user_id: user.id, is_deletable: false }).select().single();
        if(error) { console.error(error); }
        else if(data) { finalListsData.push({ id: data.id, name: data.name, is_deletable: data.is_deletable, user_id: data.user_id }); }
    }

    const { data: itemsData, error: itemsError } = await supabase
      .from('list_items')
      .select('*, lists(id)')
      .in('list_id', finalListsData.map(l => l.id));

    if (itemsError) {
      console.error('Error fetching list items:', itemsError);
      setLoading(false);
      return;
    }

    const listsWithItems = finalListsData.map((list) => ({
      ...list,
      isDeletable: !!list.is_deletable,
      items: itemsData
        .filter((item) => item.list_id === list.id)
        .map(item => ({
             id: item.media_id,
             title: item.title,
             poster_path: item.poster_path,
             media_type: item.media_type,
             release_date: item.release_date,
             added_at: new Date(item.created_at).getTime(),
        }))
        .sort((a, b) => b.added_at - a.added_at),
    })).sort((a,b) => {
      if (a.name === 'My Watchlist') return -1;
      if (b.name === 'My Watchlist') return 1;
      if (a.name === 'Watched') return -1;
      if (b.name === 'Watched') return 1;
      return a.name.localeCompare(b.name);
    });
    
    setLists(listsWithItems);
    setLoading(false);
  }, [user, toast]);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const createList = async (name: string) => {
    if (!user) return null;
    if (lists.some(list => list.name.toLowerCase() === name.toLowerCase())) {
        toast({ variant: 'destructive', title: 'Error', description: 'A list with this name already exists.' });
        throw new Error("List name already exists");
    }

    const { data, error } = await supabase
      .from('lists')
      .insert({ name, user_id: user.id, is_deletable: true })
      .select()
      .single();

    if (error) {
      console.error('Error creating list:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not create the list.' });
      return null;
    }
    
    const newList = { ...data, items: [], isDeletable: !!data.is_deletable };
    setLists(prev => [...prev, newList]);
    return newList;
  };

  const deleteList = async (listId: string) => {
    const listToDelete = lists.find(l => l.id === listId);
    if (!listToDelete || !listToDelete.isDeletable) return;

    const { error } = await supabase.from('lists').delete().eq('id', listId);
    if (error) {
        console.error('Error deleting list:', error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not delete the list.' });
    } else {
        setLists(prev => prev.filter(l => l.id !== listId));
        toast({ description: `Deleted list "${listToDelete.name}".` });
    }
  };

  const addItemToLists = async (item: CarouselItem, listIds: string[]) => {
      if (!user) return;
      
      const { data: existingItems, error: fetchError } = await supabase
        .from('list_items')
        .select('list_id')
        .eq('user_id', user.id)
        .eq('media_id', item.id)
        .eq('media_type', item.media_type)

      if (fetchError) {
        console.error('Could not verify existing items:', fetchError);
        return;
      }
      
      const currentItemLists = new Set(existingItems.map(i => i.list_id));
      
      const listsToAdd = listIds.filter(id => !currentItemLists.has(id));
      const listsToRemove = Array.from(currentItemLists).filter(id => !listIds.includes(id));
      
      if(listsToAdd.length > 0) {
          const itemsToInsert = listsToAdd.map(listId => ({
              list_id: listId,
              user_id: user.id,
              media_id: item.id,
              media_type: item.media_type,
              title: item.title,
              poster_path: item.poster_path,
              release_date: item.release_date
          }));
          const { error } = await supabase.from('list_items').insert(itemsToInsert);
          if (error) console.error("Error adding items", error);
      }

      if(listsToRemove.length > 0) {
          const { error } = await supabase.from('list_items')
              .delete()
              .eq('user_id', user.id)
              .eq('media_id', item.id)
              .eq('media_type', item.media_type)
              .in('list_id', listsToRemove);
          if (error) console.error("Error removing items", error);
      }
      
      // Debounced or batched updates would be better for performance here
      await fetchLists();
  };
  
  const addItems = async (itemsToAdd: CarouselItem[]) => {
      if (!user) return;
      const mainWatchlist = lists.find(l => l.name === 'My Watchlist');
      if (!mainWatchlist) {
          toast({ variant: 'destructive', title: 'Error', description: '"My Watchlist" not found.' });
          return;
      }

      const existingItemIds = new Set(mainWatchlist.items.map(i => `${i.media_type}-${i.id}`));
      const itemsToActuallyAdd = itemsToAdd.filter(item => !existingItemIds.has(`${item.media_type}-${item.id}`));
      
      if (itemsToActuallyAdd.length === 0) return;

      const itemsToInsert = itemsToActuallyAdd.map(item => ({
            list_id: mainWatchlist.id,
            user_id: user.id,
            media_id: item.id,
            media_type: item.media_type,
            title: item.title,
            poster_path: item.poster_path,
            release_date: item.release_date
      }));

      const { error } = await supabase.from('list_items').insert(itemsToInsert);
      if (error) {
           console.error("Error bulk adding items", error);
           toast({ variant: 'destructive', title: 'Error', description: 'Could not import all items.' });
      } else {
           await fetchLists();
      }
  };

  return (
    <WatchlistContext.Provider
      value={{
        lists,
        loading,
        createList,
        deleteList,
        addItemToLists,
        addItems,
        watchlist: lists.find(l => l.name === 'My Watchlist')?.items || [],
      }}
    >
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
