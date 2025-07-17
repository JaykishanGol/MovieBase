'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import MovieCard from './MovieCard';
import { CarouselItem as CarouselItemType } from '@/types';

interface MovieCarouselProps {
  title: string;
  items: CarouselItemType[];
}

export default function MovieCarousel({ title, items }: MovieCarouselProps) {
  return (
    <div className="w-full">
      <h2 className="mb-4 text-2xl font-bold font-headline">{title}</h2>
      <Carousel
        opts={{
          align: 'start',
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {items.map((item) => (
            <CarouselItem
              key={item.id}
              className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-4"
            >
              <MovieCard item={item} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-14" />
        <CarouselNext className="mr-14" />
      </Carousel>
    </div>
  );
}
