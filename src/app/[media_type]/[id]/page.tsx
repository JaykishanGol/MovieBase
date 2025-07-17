import Image from 'next/image';
import { getDetails } from '@/lib/tmdb';
import { Badge } from '@/components/ui/badge';
import { Star, ExternalLink, Calendar, Tv, Film, Search } from 'lucide-react';
import WatchlistButton from '@/components/WatchlistButton';
import { notFound } from 'next/navigation';
import { Movie, TVShow } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function DetailPage({
  params,
}: {
  params: { media_type: 'movie' | 'tv'; id: string };
}) {
  if (params.media_type !== 'movie' && params.media_type !== 'tv') {
    notFound();
  }

  const data: Movie | TVShow = await getDetails(
    params.media_type,
    params.id
  );
  const isMovie = params.media_type === 'movie';
  const item = data as Movie;
  const show = data as TVShow;

  const title = isMovie ? item.title : show.name;
  const releaseDate = isMovie ? item.release_date : show.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  
  const externalLinks = [
    data.external_ids?.imdb_id && {
      name: 'IMDb',
      url: `https://www.imdb.com/title/${data.external_ids.imdb_id}`,
      icon: <ExternalLink className="ml-2 h-4 w-4" />,
    },
    {
      name: 'Rotten Tomatoes',
      url: `https://www.rottentomatoes.com/search?search=${encodeURIComponent(title)}`,
      icon: <ExternalLink className="ml-2 h-4 w-4" />,
    },
    {
      name: 'Reddit',
      url: `https://www.reddit.com/r/${isMovie ? 'movies' : 'television'}/search/?q=${encodeURIComponent(title)} ${year}&restrict_sr=1`,
      icon: <ExternalLink className="ml-2 h-4 w-4" />,
    },
  ].filter(Boolean);

  return (
    <div>
      <div className="relative h-[50vh] w-full">
        <Image
          src={`https://image.tmdb.org/t/p/original${data.backdrop_path}`}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="absolute z-0 opacity-30"
          data-ai-hint="movie backdrop"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
      </div>

      <div className="container relative z-20 -mt-48 pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="aspect-[2/3] relative">
              <Image
                src={`https://image.tmdb.org/t/p/w780${data.poster_path}`}
                alt={title}
                layout="fill"
                objectFit="cover"
                className="rounded-lg shadow-2xl"
                data-ai-hint="movie poster"
              />
            </div>
            <div className="mt-4">
              <WatchlistButton item={{
                id: data.id,
                title: title,
                poster_path: data.poster_path,
                media_type: params.media_type,
                release_date: releaseDate,
              }} />
            </div>
          </div>
          <div className="w-full md:w-2/3 lg:w-3/4 pt-8 md:pt-16">
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                    {isMovie ? <Film className="h-4 w-4" /> : <Tv className="h-4 w-4" />}
                    <span>{isMovie ? 'Movie' : 'TV Show'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{year || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>{data.vote_average.toFixed(1)} / 10</span>
                </div>
                {isMovie && item.runtime && <span>{Math.floor(item.runtime / 60)}h {item.runtime % 60}m</span>}
                {!isMovie && show.number_of_seasons && <span>{show.number_of_seasons} Season(s)</span>}
            </div>

            <h1 className="mt-4 text-5xl font-bold font-headline">{title}</h1>
            
            <div className="mt-4 flex flex-wrap gap-2">
              {data.genres.map((genre) => (
                <Badge key={genre.id} variant="secondary">
                  {genre.name}
                </Badge>
              ))}
            </div>

            <p className="mt-6 text-lg text-foreground/80">{data.overview}</p>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">External Links</h3>
              <div className="flex flex-wrap gap-4 items-center">
                {externalLinks.map(link => link && (
                  <Button asChild key={link.name} variant="outline">
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.name} {link.icon}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Torrent Search</h3>
                <Button asChild>
                  <Link href={`/search-generator?title=${encodeURIComponent(title)}&year=${year}`}>
                    <Search className="mr-2 h-4 w-4" />
                    Generate Search URLs
                  </Link>
                </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
