'use client';

import { useWatchlist } from '@/contexts/WatchlistContext';
import MovieCarousel from './MovieCarousel';
import { Loader2 } from 'lucide-react';

export default function WatchlistCarousel() {
  const { watchlist, loading } = useWatchlist();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-20">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (watchlist.length === 0) {
    return null; // Don't show the carousel if the watchlist is empty
  }

  return <MovieCarousel title="My Watchlist" items={watchlist} />;
}
