
'use client';

import { useState, useMemo } from 'react';
import MovieCard from '@/components/MovieCard';
import { useWatchlist } from '@/contexts/WatchlistContext';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { notFound, useParams } from 'next/navigation';
import { CarouselItem } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type SortOption = 'added_at' | 'release_date' | 'title';

export default function ListDetailPage() {
  const { lists, loading } = useWatchlist();
  const params = useParams();
  const listId = params.list_id as string;
  const [filter, setFilter] = useState<'all' | 'movie' | 'tv'>('all');
  const [sort, setSort] = useState<SortOption>('added_at');

  const list = useMemo(() => {
    if (loading) return undefined;
    return lists.find(l => l.id === listId);
  }, [lists, listId, loading]);

  const sortedAndFilteredItems = useMemo(() => {
    if (!list) return [];
    
    let items = [...list.items];

    // Filter
    if (filter !== 'all') {
      items = items.filter((item: CarouselItem) => item.media_type === filter);
    }
    
    // Sort
    items.sort((a, b) => {
        switch (sort) {
            case 'added_at':
                return (b.added_at ?? 0) - (a.added_at ?? 0);
            case 'release_date':
                return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
            case 'title':
                return a.title.localeCompare(b.title);
            default:
                return 0;
        }
    });

    return items;
  }, [list, filter, sort]);

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
            {sortedAndFilteredItems.length > 0 && (
                <span className="text-lg text-muted-foreground">({sortedAndFilteredItems.length} items)</span>
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
            <Select value={sort} onValueChange={(value) => setSort(value as SortOption)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="added_at">Recently Added</SelectItem>
                <SelectItem value="release_date">Release Date</SelectItem>
                <SelectItem value="title">A-Z</SelectItem>
              </SelectContent>
            </Select>
        </div>
      </div>

      {list.items.length > 0 ? (
        sortedAndFilteredItems.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {sortedAndFilteredItems.map((item) => (
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
