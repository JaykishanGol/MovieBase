'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { CarouselItem } from '@/types';
import { useAuth } from './AuthContext';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from 'firebase/firestore';
import { firebaseApp } from '@/lib/firebase';

interface WatchlistContextType {
  watchlist: CarouselItem[];
  addItem: (item: CarouselItem) => void;
  removeItem: (id: number, media_type: 'movie' | 'tv') => void;
  loading: boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(
  undefined
);

const db = getFirestore(firebaseApp);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: () => void = () => {};
    if (user) {
      setLoading(true);
      const docRef = doc(db, 'watchlists', user.uid);
      unsubscribe = onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            setWatchlist(docSnap.data().items || []);
          } else {
            setWatchlist([]);
          }
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching watchlist:", error);
          setLoading(false);
        }
      );
    } else {
      setWatchlist([]);
      setLoading(false);
    }

    return () => unsubscribe();
  }, [user]);

  const addItem = async (item: CarouselItem) => {
    if (!user) return;
    const docRef = doc(db, 'watchlists', user.uid);
    await setDoc(docRef, { items: arrayUnion(item) }, { merge: true });
  };

  const removeItem = async (id: number, media_type: 'movie' | 'tv') => {
    if (!user) return;
    const docRef = doc(db, 'watchlists', user.uid);
    const itemToRemove = watchlist.find(
      (item) => item.id === id && item.media_type === media_type
    );
    if (itemToRemove) {
      await setDoc(
        docRef,
        { items: arrayRemove(itemToRemove) },
        { merge: true }
      );
    }
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
