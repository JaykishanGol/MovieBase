
'use client';

import { useState, useMemo, Suspense } from 'react';
import MovieCard from '@/components/MovieCard';
import { useWatchlist, Watchlist } from '@/contexts/WatchlistContext';
import { Loader2, Settings, CheckSquare, Square } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import BulkActionsDialog from '@/components/BulkActionsDialog';

type SortOption = 'added_at' | 'release_date' | 'title';
type ItemKey = `${'movie' | 'tv'}-${number}`;

function ListDetail() {
  const { lists, loading, bulkDeleteItems } = useWatchlist();
  const params = useParams();
  const listId = params.list_id as string;
  const [filter, setFilter] = useState<'all' | 'movie' | 'tv'>('all');
  const [sort, setSort] = useState<SortOption>('added_at');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<ItemKey>>(new Set());
  const [isBulkActionDialogOpen, setIsBulkActionDialogOpen] = useState(false);

  const list = useMemo(() => {
    if (loading) return undefined;
    return lists.find((l) => l.id === listId);
  }, [lists, listId, loading]);

  const sortedAndFilteredItems = useMemo(() => {
    if (!list) return [];

    let items = [...list.items];

    if (filter !== 'all') {
      items = items.filter((item: CarouselItem) => item.media_type === filter);
    }

    items.sort((a, b) => {
      switch (sort) {
        case 'added_at':
          return (b.added_at ?? 0) - (a.added_at ?? 0);
        case 'release_date':
          return (
            new Date(b.release_date).getTime() -
            new Date(a.release_date).getTime()
          );
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return items;
  }, [list, filter, sort]);
  
  const toggleSelection = (item: CarouselItem) => {
    const key: ItemKey = `${item.media_type}-${item.id}`;
    setSelectedItems(prev => {
        const next = new Set(prev);
        if (next.has(key)) {
            next.delete(key);
        } else {
            next.add(key);
        }
        return next;
    });
  };
  
  const toggleSelectAll = () => {
    if (selectedItems.size === sortedAndFilteredItems.length) {
      setSelectedItems(new Set());
    } else {
      const allItemKeys = new Set(sortedAndFilteredItems.map(item => `${item.media_type}-${item.id}` as ItemKey));
      setSelectedItems(allItemKeys);
    }
  };


  const handleBulkDelete = async () => {
    if (!list || selectedItems.size === 0) return;

    const itemsToDelete = Array.from(selectedItems).map(key => {
        const [media_type, media_id] = key.split('-');
        return { media_type: media_type as 'movie' | 'tv', media_id: parseInt(media_id, 10) };
    });
    
    await bulkDeleteItems(list.id, itemsToDelete);
    setSelectedItems(new Set());
    setSelectionMode(false);
  };
  
  const handleExitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedItems(new Set());
  }


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
  
  const selectedItemObjects = Array.from(selectedItems).map(key => {
    const [media_type, media_id] = key.split('-');
    return sortedAndFilteredItems.find(i => i.media_type === media_type && i.id === parseInt(media_id, 10))!;
  }).filter(Boolean);


  return (
    <div className="container py-8">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold font-headline">{list.name}</h1>
          {sortedAndFilteredItems.length > 0 && (
            <span className="text-lg text-muted-foreground">
              ({sortedAndFilteredItems.length} items)
            </span>
          )}
        </div>
        {!selectionMode && (
           <div className="flex items-center gap-4">
              <Tabs
                  value={filter}
                  onValueChange={(value) =>
                  setFilter(value as 'all' | 'movie' | 'tv')
                  }
              >
                  <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="movie">Movies</TabsTrigger>
                  <TabsTrigger value="tv">TV Shows</TabsTrigger>
                  </TabsList>
              </Tabs>
              <Select
                  value={sort}
                  onValueChange={(value) => setSort(value as SortOption)}
              >
                  <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                  <SelectItem value="added_at">Recently Added</SelectItem>
                  <SelectItem value="release_date">Release Date</SelectItem>
                  <SelectItem value="title">A-Z</SelectItem>
                  </SelectContent>
              </Select>
               {list.items.length > 0 && (
                 <Button variant="outline" onClick={() => setSelectionMode(true)}>
                    <Settings className="mr-2 h-4 w-4" /> Manage
                </Button>
               )}
          </div>
        )}
      </div>

       {selectionMode && (
          <div className="sticky top-14 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 mb-4 border-b">
              <div className="container flex justify-between items-center">
                  <div className="flex items-center gap-4">
                      <Button variant="ghost" size="icon" onClick={toggleSelectAll} title={selectedItems.size === sortedAndFilteredItems.length ? "Deselect All" : "Select All"}>
                        {selectedItems.size === sortedAndFilteredItems.length ? <CheckSquare /> : <Square />}
                      </Button>
                      <span className="text-lg font-medium">{selectedItems.size} selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                       <Button variant="outline" onClick={() => setIsBulkActionDialogOpen(true)} disabled={selectedItems.size === 0}>Move</Button>
                      <Button variant="destructive" onClick={handleBulkDelete} disabled={selectedItems.size === 0}>Delete</Button>
                      <Button variant="ghost" onClick={handleExitSelectionMode}>Done</Button>
                  </div>
              </div>
          </div>
       )}
      
      {list.items.length > 0 ? (
        sortedAndFilteredItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {sortedAndFilteredItems.map((item) => (
              <MovieCard
                key={`${item.media_type}-${item.id}`}
                item={item}
                selectionMode={selectionMode}
                isSelected={selectedItems.has(`${item.media_type}-${item.id}`)}
                onSelectionChange={() => toggleSelection(item)}
              />
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
      
      <BulkActionsDialog
        isOpen={isBulkActionDialogOpen}
        onOpenChange={setIsBulkActionDialogOpen}
        sourceList={list}
        selectedItems={selectedItemObjects}
        onActionComplete={() => {
            setSelectedItems(new Set());
            setSelectionMode(false);
        }}
      />
    </div>
  );
}

export default function ListDetailPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <ListDetail />
        </Suspense>
    )
}
