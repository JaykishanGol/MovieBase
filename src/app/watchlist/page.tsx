
'use client';

import { useState, useMemo } from 'react';
import MovieCard from '@/components/MovieCard';
import { useWatchlist } from '@/contexts/WatchlistContext';
import { Loader2, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function WatchlistPage() {
  const { watchlist, loading } = useWatchlist();
  const [filter, setFilter] = useState<'all' | 'movie' | 'tv'>('all');

  const filteredWatchlist = useMemo(() => {
    if (filter === 'all') {
      return watchlist;
    }
    return watchlist.filter((item) => item.media_type === filter);
  }, [watchlist, filter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold font-headline">My Watchlist</h1>
            {filteredWatchlist.length > 0 && (
                <span className="text-lg text-muted-foreground">({filteredWatchlist.length} items)</span>
            )}
        </div>
        <div className="flex items-center gap-4">
            <Tabs value={filter} onValueChange={(value) => setFilter(value as 'all' | 'movie' | 'tv')}>
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="movie">Movies</TabsTrigger>
                    <TabsTrigger value="tv">TV Shows</TabsTrigger>
                </TabsList>
            </Tabs>
            <Button asChild variant="outline">
              <Link href="/import">
                <UploadCloud className="mr-2 h-4 w-4" />
                Import
              </Link>
            </Button>
        </div>
      </div>

      {watchlist.length > 0 ? (
        filteredWatchlist.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredWatchlist.map((item) => (
                <MovieCard key={`${item.media_type}-${item.id}`} item={item} showMoveToWatched />
            ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
                <p className="text-lg">No items match your filter.</p>
                <p>Try selecting another category.</p>
            </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
          <p className="text-lg">Your watchlist is empty.</p>
          <p>Add movies and shows to see them here, or import your Google Watchlist.</p>
        </div>
      )}
    </div>
  );
}
