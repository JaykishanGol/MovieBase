
'use client';

import { useState, useMemo } from 'react';
import MovieCard from '@/components/MovieCard';
import { useWatched } from '@/contexts/WatchedContext';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function WatchedPage() {
  const { watched, loading } = useWatched();
  const [filter, setFilter] = useState<'all' | 'movie' | 'tv'>('all');

  const filteredWatched = useMemo(() => {
    if (filter === 'all') {
      return watched;
    }
    return watched.filter((item) => item.media_type === filter);
  }, [watched, filter]);

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
          <h1 className="text-3xl font-bold font-headline">Watched List</h1>
          {filteredWatched.length > 0 && (
            <span className="text-lg text-muted-foreground">({filteredWatched.length} items)</span>
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
        </div>
      </div>

      {watched.length > 0 ? (
        filteredWatched.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredWatched.map((item) => (
              <MovieCard key={`${item.media_type}-${item.id}`} item={item} />
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
          <p className="text-lg">Your watched list is empty.</p>
          <p>Move items from your watchlist here once you've seen them.</p>
        </div>
      )}
    </div>
  );
}
