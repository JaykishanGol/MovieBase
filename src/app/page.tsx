import Link from 'next/link';
import Image from 'next/image';
import { getTrending } from '@/lib/tmdb';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';
import GenreTabs from '@/components/GenreTabs';
import WatchlistCarousel from '@/components/WatchlistCarousel';

export default async function Home() {
  const trendingMovies = await getTrending('movie');
  const heroItem = trendingMovies.results[0];

  return (
    <div className="flex flex-col">
      {heroItem && (
        <div className="relative h-[60vh] w-full">
          <Image
            src={`https://image.tmdb.org/t/p/original${heroItem.backdrop_path}`}
            alt={heroItem.title}
            layout="fill"
            objectFit="cover"
            className="absolute z-0"
            data-ai-hint="movie backdrop"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
          <div className="container relative z-20 flex h-full flex-col justify-end pb-12 text-white">
            <h1 className="text-5xl font-bold font-headline">{heroItem.title}</h1>
            <p className="mt-4 max-w-2xl text-lg text-foreground/80">{heroItem.overview}</p>
            <div className="mt-6">
              <Button asChild size="lg">
                <Link href={`/movie/${heroItem.id}`}>
                  <PlayCircle className="mr-2 h-6 w-6" />
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="container py-12 space-y-12">
        <WatchlistCarousel />
        <GenreTabs />
      </div>
    </div>
  );
}
