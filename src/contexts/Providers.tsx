
'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { WatchlistProvider } from '@/contexts/WatchlistContext';
import { TorrentSettingsProvider } from '@/contexts/TorrentSettingsContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <WatchlistProvider>
          <TorrentSettingsProvider>{children}</TorrentSettingsProvider>
        </WatchlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
