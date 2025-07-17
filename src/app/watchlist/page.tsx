'use client';

import MovieCard from '@/components/MovieCard';
import { useWatchlist } from '@/contexts/WatchlistContext';

export default function WatchlistPage() {
  const { watchlist } = useWatchlist();

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold font-headline">My Watchlist</h1>
      {watchlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {watchlist.map((item) => (
            <MovieCard key={`${item.media_type}-${item.id}`} item={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
          <p className="text-lg">Your watchlist is empty.</p>
          <p>Add movies and shows to see them here.</p>
        </div>
      )}
    </div>
  );
}
