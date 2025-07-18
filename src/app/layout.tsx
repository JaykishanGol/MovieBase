import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { WatchlistProvider } from '@/contexts/WatchlistContext';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import { TorrentSettingsProvider } from '@/contexts/TorrentSettingsContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { WatchedProvider } from '@/contexts/WatchedContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'MovieBase',
  description: 'Your personal movie and TV show catalog.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-body antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <WatchlistProvider>
            <WatchedProvider>
              <TorrentSettingsProvider>
                <Header />
                <main>{children}</main>
                <Toaster />
              </TorrentSettingsProvider>
            </WatchedProvider>
          </WatchlistProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
