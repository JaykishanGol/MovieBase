
'use client';

import { CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useWatchlist } from '@/contexts/WatchlistContext';
import { useWatched } from '@/contexts/WatchedContext';
import { useToast } from '@/hooks/use-toast';
import { CarouselItem } from '@/types';

interface MoveToWatchedButtonProps {
  item: CarouselItem;
}

export default function MoveToWatchedButton({ item }: MoveToWatchedButtonProps) {
  const { removeItem: removeFromWatchlist } = useWatchlist();
  const { addItem: addToWatched } = useWatched();
  const { toast } = useToast();

  const handleMoveToWatched = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToWatched(item);
    removeFromWatchlist(item.id, item.media_type);

    toast({
      description: `Moved "${item.title}" to your watched list.`,
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleMoveToWatched}
      className="bg-black/50 hover:bg-black/70 text-white rounded-full"
    >
      <CheckCircle className="h-5 w-5" />
      <span className="sr-only">Move to Watched</span>
    </Button>
  );
}
