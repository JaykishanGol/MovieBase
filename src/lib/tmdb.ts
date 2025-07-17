const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

async function fetchFromTMDB(endpoint: string) {
  if (!API_KEY) {
    throw new Error('TMDB_API_KEY is not defined in environment variables.');
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', API_KEY);

  const response = await fetch(url.toString());
  if (!response.ok) {
    console.error(await response.json());
    throw new Error(`Failed to fetch from TMDB: ${response.statusText}`);
  }
  return response.json();
}

export async function getTrending(media_type: 'movie' | 'tv', time_window: 'day' | 'week' = 'day') {
  return fetchFromTMDB(`/trending/${media_type}/${time_window}`);
}

export async function getDetails(media_type: 'movie' | 'tv', id: string) {
  return fetchFromTMDB(`/${media_type}/${id}?append_to_response=external_ids`);
}

export async function search(query: string) {
  return fetchFromTMDB(`/search/multi?query=${encodeURIComponent(query)}`);
}
