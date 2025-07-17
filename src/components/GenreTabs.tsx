'use client';

import { useState, useEffect, use } from 'react';
import { getGenres, discoverMedia } from '@/lib/tmdb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MovieCarousel from './MovieCarousel';
import { CarouselItem as CarouselItemType } from '@/types';
import { Loader2 } from 'lucide-react';

interface Genre {
  id: number;
  name: string;
}

function transformToCarouselItems(
  results: any[],
  mediaType: 'movie' | 'tv'
): CarouselItemType[] {
  return results.map((item) => ({
    id: item.id,
    title: item.title || item.name,
    poster_path: item.poster_path,
    media_type: mediaType,
    release_date: item.release_date || item.first_air_date,
  }));
}

const GenreCarouselLoader = () => (
    <div className="flex items-center justify-center h-80 w-full bg-card rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin" />
    </div>
);

function GenreCarousels({ genreId }: { genreId: string }) {
  const [movieItems, setMovieItems] = useState<CarouselItemType[]>([]);
  const [tvItems, setTvItems] = useState<CarouselItemType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!genreId) return;

    const fetchMedia = async () => {
      setLoading(true);
      try {
        const [movieRes, tvRes] = await Promise.all([
          discoverMedia('movie', genreId),
          discoverMedia('tv', genreId),
        ]);
        setMovieItems(transformToCarouselItems(movieRes.results, 'movie'));
        setTvItems(transformToCarouselItems(tvRes.results, 'tv'));
      } catch (error) {
        console.error("Failed to fetch media for genre:", error);
        setMovieItems([]);
        setTvItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [genreId]);

  if (loading) {
    return <GenreCarouselLoader />;
  }

  return (
    <div className="space-y-12">
      {movieItems.length > 0 && <MovieCarousel title="Movies" items={movieItems} />}
      {tvItems.length > 0 && <MovieCarousel title="TV Shows" items={tvItems} />}
    </div>
  );
}


export default function GenreTabs() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      setLoading(true);
      try {
        const { genres: movieGenres } = await getGenres('movie');
        // Using movie genres as they are more comprehensive
        setGenres(movieGenres);
        if (movieGenres.length > 0) {
          setSelectedGenre(String(movieGenres[0].id));
        }
      } catch (error) {
        console.error("Failed to fetch genres:", error);
        setGenres([]);
      }
      setLoading(false);
    };
    fetchGenres();
  }, []);

  if (loading || genres.length === 0) {
    return (
        <div className="flex items-center justify-center h-96 w-full">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  return (
    <Tabs value={selectedGenre ?? ''} onValueChange={setSelectedGenre} className="w-full">
      <TabsList className="flex-wrap h-auto justify-start">
        {genres.map((genre) => (
          <TabsTrigger key={genre.id} value={String(genre.id)}>
            {genre.name}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {selectedGenre && (
        <TabsContent value={selectedGenre} className="mt-6">
           <GenreCarousels genreId={selectedGenre} />
        </TabsContent>
      )}

    </Tabs>
  );
}
