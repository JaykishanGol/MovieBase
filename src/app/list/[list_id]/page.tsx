
'use client';

import { useState, useMemo } from 'react';
import MovieCard from '@/components/MovieCard';
import { useWatchlist } from '@/contexts/WatchlistContext';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { notFound, useParams } from 'next/navigation';
import { CarouselItem } from '@/types';

export default function ListDetailPage() {
  const { lists, loading } = useWatchlist();
  const params = useParams();
  const listId = params.list_id as string;
  const [filter, setFilter] = useState<'all' | 'movie' | 'tv'>('all');

  const list = useMemo(() => {
    if (loading) return undefined;
    return lists.find(l => l.id === listId);
  }, [lists, listId, loading]);

  const filteredItems = useMemo(() => {
    if (!list) return [];
    if (filter === 'all') {
      return list.items;
    }
    return list.items.filter((item: CarouselItem) => item.media_type === filter);
  }, [list, filter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!list) {
    notFound();
  }

  return (
    <div className="container py-8">
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold font-headline">{list.name}</h1>
            {filteredItems.length > 0 && (
                <span className="text-lg text-muted-foreground">({filteredItems.length} items)</span>
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

      {list.items.length > 0 ? (
        filteredItems.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredItems.map((item) => (
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
          <p className="text-lg">This list is empty.</p>
          <p>Add movies and shows to see them here.</p>
        </div>
      )}
    </div>
  );
}
