import MovieCard from '@/components/MovieCard';
import { search } from '@/lib/tmdb';
import { CarouselItem, SearchResult } from '@/types';

function transformToCarouselItem(item: SearchResult): CarouselItem | null {
  if (item.media_type !== 'movie' && item.media_type !== 'tv') {
    return null;
  }
  return {
    id: item.id,
    title: item.title || item.name || 'No title',
    poster_path: item.poster_path,
    media_type: item.media_type,
    release_date: item.release_date || item.first_air_date || '',
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { query?: string };
}) {
  const query = searchParams?.query || '';
  const searchResults = await search(query);
  const items = searchResults.results
    .map(transformToCarouselItem)
    .filter((item: CarouselItem | null): item is CarouselItem => item !== null && !!item.poster_path);

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold font-headline">
        Search Results for "{query}"
      </h1>
      {items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {items.map((item) => (
            <MovieCard key={`${item.media_type}-${item.id}`} item={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
          <p className="text-lg">No results found for "{query}".</p>
          <p>Try searching for something else.</p>
        </div>
      )}
    </div>
  );
}
