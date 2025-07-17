'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Dices } from 'lucide-react';
import { getPopular } from '@/lib/tmdb';
import { useToast } from '@/hooks/use-toast';

export default function SurpriseMe() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSurprise = async () => {
    try {
      const popularMovies = await getPopular('movie');
      if (popularMovies.results.length > 0) {
        const randomMovie =
          popularMovies.results[
            Math.floor(Math.random() * popularMovies.results.length)
          ];
        router.push(`/movie/${randomMovie.id}`);
      }
    } catch (error) {
      console.error('Failed to fetch a random movie:', error);
      toast({
        variant: 'destructive',
        title: 'Could not find a movie',
        description: 'Please try again later.',
      });
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleSurprise}>
      <Dices className="h-5 w-5" />
      <span className="sr-only">Surprise Me</span>
    </Button>
  );
}
