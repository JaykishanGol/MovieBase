
import MovieCard from '@/components/MovieCard';
import { discoverMedia } from '@/lib/tmdb';
import { CarouselItem } from '@/types';
import { notFound } from 'next/navigation';

export default async function GenrePage({
  params,
  searchParams,
}: {
  params: { media_type: 'movie' | 'tv'; genre_id: string };
  searchParams?: { name?: string };
}) {
  if (
    (params.media_type !== 'movie' && params.media_type !== 'tv') ||
    !params.genre_id
  ) {
    notFound();
  }

  const genreName = searchParams?.name || 'Genre';
  const media = await discoverMedia(params.media_type, params.genre_id);

  const items: CarouselItem[] = media.results
    .map((item: any) => ({
      id: item.id,
      title: item.title || item.name,
      poster_path: item.poster_path,
      media_type: params.media_type,
      release_date: item.release_date || item.first_air_date,
    }))
    .filter((item: CarouselItem) => !!item.poster_path);

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold font-headline">
        {genreName} {params.media_type === 'movie' ? 'Movies' : 'TV Shows'}
      </h1>
      {items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {items.map((item) => (
            <MovieCard key={`${item.media_type}-${item.id}`} item={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
          <p className="text-lg">No results found in this genre.</p>
        </div>
      )}
    </div>
  );
}
