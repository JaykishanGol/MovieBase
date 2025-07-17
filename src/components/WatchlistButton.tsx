'use client';

import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from './ui/button';
import { useWatchlist } from '@/contexts/WatchlistContext';
import { useToast } from '@/hooks/use-toast';
import { CarouselItem } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface WatchlistButtonProps {
  item: CarouselItem;
}

export default function WatchlistButton({ item }: WatchlistButtonProps) {
  const { watchlist, addItem, removeItem } = useWatchlist();
  const { user, login } = useAuth();
  const { toast } = useToast();
  const isInWatchlist = watchlist.some((i) => i.id === item.id && i.media_type === item.media_type);

  const handleToggleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to manage your watchlist.",
        variant: "destructive",
        action: <Button onClick={login}>Login</Button>,
      });
      return;
    }

    if (isInWatchlist) {
      removeItem(item.id, item.media_type);
      toast({
        description: `Removed "${item.title}" from your watchlist.`,
      });
    } else {
      addItem(item);
      toast({
        description: `Added "${item.title}" to your watchlist.`,
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleWatchlist}
      className="bg-black/50 hover:bg-black/70 text-white rounded-full"
    >
      {isInWatchlist ? (
        <BookmarkCheck className="h-5 w-5 text-primary" />
      ) : (
        <Bookmark className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle Watchlist</span>
    </Button>
  );
}
