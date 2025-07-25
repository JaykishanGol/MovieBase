'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import WatchlistButton from './WatchlistButton';
import { CarouselItem } from '@/types';
import { cn } from '@/lib/utils';
import { CheckSquare, Square } from 'lucide-react';

interface MovieCardProps {
  item: CarouselItem;
  selectionMode?: boolean;
  isSelected?: boolean;
  onSelectionChange?: () => void;
}

export default function MovieCard({ item, selectionMode = false, isSelected = false, onSelectionChange }: MovieCardProps) {
  
  const handleCardClick = (e: React.MouseEvent) => {
    if (selectionMode) {
      e.preventDefault();
      onSelectionChange?.();
    }
  };
  
  return (
    <Card 
        className={cn(
            "group relative w-full transform-gpu transition-all duration-300 ease-in-out", 
            !selectionMode && "hover:scale-105 hover:z-10",
            selectionMode && "cursor-pointer",
            isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background"
        )}
        onClick={handleCardClick}
    >
      <Link href={`/${item.media_type}/${item.id}`} onClick={handleCardClick}>
        <CardContent className="p-0">
          <div className="aspect-[2/3] w-full overflow-hidden rounded-md">
            <Image
              src={
                item.poster_path
                  ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                  : 'https://placehold.co/500x750.png'
              }
              alt={item.title}
              width={500}
              height={750}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              data-ai-hint="movie poster"
            />
          </div>
        </CardContent>
      </Link>
      
      {selectionMode ? (
        <div className="absolute top-2 left-2 z-20 text-white bg-black/50 rounded-full p-1">
            {isSelected ? <CheckSquare className="h-6 w-6 text-primary" /> : <Square className="h-6 w-6" />}
        </div>
      ) : (
        <div className="absolute top-2 right-2 z-20 flex flex-col gap-2">
            <WatchlistButton item={item} />
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
        <h3 className="font-semibold text-white truncate">{item.title}</h3>
      </div>
    </Card>
  );
}
