import { useWatchlist } from '@/contexts/WatchlistContext';
import MovieCarousel from './MovieCarousel';
import { Loader2 } from 'lucide-react';

export default function WatchlistCarousel() {
  const { lists, loading } = useWatchlist();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-20">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const mainWatchlist = lists.find(list => list.name === 'My Watchlist');

  if (!mainWatchlist || mainWatchlist.items.length === 0) {
    return null; // Don't show the carousel if the main watchlist is empty
  }

  return <MovieCarousel title="My Watchlist" items={mainWatchlist.items} />;
}
