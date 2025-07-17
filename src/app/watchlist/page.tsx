
'use client';

import MovieCard from '@/components/MovieCard';
import { useWatchlist } from '@/contexts/WatchlistContext';
import { Loader2, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function WatchlistPage() {
  const { watchlist, loading } = useWatchlist();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">My Watchlist</h1>
        <Button asChild variant="outline">
          <Link href="/import">
            <UploadCloud className="mr-2 h-4 w-4" />
            Import Watchlist
          </Link>
        </Button>
      </div>

      {watchlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {watchlist.map((item) => (
            <MovieCard key={`${item.media_type}-${item.id}`} item={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
          <p className="text-lg">Your watchlist is empty.</p>
          <p>Add movies and shows to see them here, or import your Google Watchlist.</p>
        </div>
      )}
    </div>
  );
}
