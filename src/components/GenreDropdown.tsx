
'use client';

import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { getGenres } from '@/lib/tmdb';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface Genre {
  id: number;
  name: string;
}

interface GenreDropdownProps {
  media_type: 'movie' | 'tv';
}

export default function GenreDropdown({ media_type }: GenreDropdownProps) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchGenres() {
      const data = await getGenres(media_type);
      setGenres(data.genres);
    }
    fetchGenres();
  }, [media_type]);
  
  const isActive = pathname.startsWith(`/discover/${media_type}`);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={cn(
            'p-0 h-auto transition-colors hover:text-primary focus-visible:ring-0 focus-visible:ring-offset-0',
            isActive ? 'text-primary' : 'text-foreground/60'
          )}>
          {media_type === 'movie' ? 'Movie Genres' : 'TV Show Genres'}
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-96 overflow-y-auto">
        {genres.map((genre) => (
          <DropdownMenuItem key={genre.id} asChild>
            <Link href={`/discover/${media_type}/${genre.id}?name=${encodeURIComponent(genre.name)}`}>
              {genre.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
