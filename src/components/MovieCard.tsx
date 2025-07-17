'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import WatchlistButton from './WatchlistButton';
import { CarouselItem } from '@/types';

interface MovieCardProps {
  item: CarouselItem;
}

export default function MovieCard({ item }: MovieCardProps) {
  return (
    <Card className="group relative w-full transform-gpu transition-all duration-300 ease-in-out hover:scale-105 hover:z-10">
      <Link href={`/${item.media_type}/${item.id}`}>
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
      <div className="absolute top-2 right-2 z-20">
        <WatchlistButton item={item} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
        <h3 className="font-semibold text-white truncate">{item.title}</h3>
      </div>
    </Card>
  );
}
