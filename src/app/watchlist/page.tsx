'use client';

import MovieCard from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
// import { useAuth } from '@/contexts/AuthContext';
// import { useWatchlist } from '@/contexts/WatchlistContext';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function WatchlistPage() {
  // const { watchlist, loading: watchlistLoading } = useWatchlist();
  // const { user, loading: authLoading, login } = useAuth();
  // const loading = authLoading || watchlistLoading;
  const watchlist = [];
  const loading = false;
  const user = null;
  const login = () => {};


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
       <div className="container py-8 text-center">
        <h1 className="mb-8 text-3xl font-bold font-headline">My Watchlist</h1>
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
          <p className="text-lg mb-4">Please log in to view your watchlist.</p>
          <Button onClick={login}>Login with Google</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold font-headline">My Watchlist</h1>
      {watchlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {watchlist.map((item) => (
            <MovieCard key={`${item.media_type}-${item.id}`} item={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
          <p className="text-lg">Your watchlist is empty.</p>
          <p>Add movies and shows to see them here.</p>
        </div>
      )}
    </div>
  );
}
