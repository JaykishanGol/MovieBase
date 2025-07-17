'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from './ui/input';
import { Loader2, Search as SearchIcon } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { search } from '@/lib/tmdb';
import { SearchResult } from '@/types';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const debouncedQuery = useDebounce(query, 300);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setShowSuggestions(false);
    }
  };

  const fetchSuggestions = useCallback(async () => {
    if (debouncedQuery.trim().length > 2) {
      setLoading(true);
      const searchResults = await search(debouncedQuery);
      setResults(searchResults.results.filter((r: SearchResult) => (r.media_type === 'movie' || r.media_type === 'tv') && r.poster_path).slice(0, 5));
      setLoading(false);
      setShowSuggestions(true);
    } else {
      setResults([]);
      setShowSuggestions(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSuggestionClick = () => {
    setQuery('');
    setShowSuggestions(false);
  }

  return (
    <div className="relative w-full max-w-xs" ref={searchContainerRef}>
      <form onSubmit={handleSearch} className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search movies & shows..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 2 && setShowSuggestions(true)}
          className="pl-9"
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />}
      </form>
      {showSuggestions && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-card border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <ul>
            {results.map((item) => (
              <li key={`${item.media_type}-${item.id}`}>
                <Link 
                  href={`/${item.media_type}/${item.id}`} 
                  className="flex items-center gap-4 p-2 hover:bg-muted"
                  onClick={handleSuggestionClick}
                >
                  <Image
                    src={item.poster_path ? `https://image.tmdb.org/t/p/w92${item.poster_path}` : 'https://placehold.co/92x138.png'}
                    alt={item.title || item.name || 'Poster'}
                    width={40}
                    height={60}
                    className="rounded-sm"
                  />
                  <div className='flex-1'>
                    <p className="font-semibold truncate">{item.title || item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.release_date?.substring(0,4) || item.first_air_date?.substring(0,4)}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
