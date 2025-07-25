'use client';

import WatchlistCarousel from './WatchlistCarousel';
import MovieCarousel from './MovieCarousel';
import { CarouselItem } from '@/types';

interface HomeClientComponentsProps {
    movieCarousel: {
        title: string;
        items: CarouselItem[];
    };
    tvShowCarousel: {
        title: string;
        items: CarouselItem[];
    };
}

export default function HomeClientComponents({ movieCarousel, tvShowCarousel }: HomeClientComponentsProps) {
    return (
        <div className="container py-12 space-y-12">
            <WatchlistCarousel />
            <MovieCarousel title={movieCarousel.title} items={movieCarousel.items} />
            <MovieCarousel title={tvShowCarousel.title} items={tvShowCarousel.items} />
        </div>
    );
}
