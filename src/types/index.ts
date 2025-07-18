export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  imdb_id?: string;
  genres: { id: number; name: string }[];
  runtime: number;
  external_ids?: {
    imdb_id: string | null;
  };
}

export interface TVShow {
  id:number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  first_air_date: string;
  vote_average: number;
  genres: { id: number; name: string }[];
  number_of_seasons: number;
  external_ids?: {
    imdb_id: string | null;
  };
}

export type CarouselItem = {
    id: number;
    title: string;
    poster_path: string | null;
    media_type: 'movie' | 'tv';
    release_date: string;
    added_at?: number;
};

export type SearchResult = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  media_type: 'movie' | 'tv' | 'person';
  release_date?: string;
  first_air_date?: string;
};
