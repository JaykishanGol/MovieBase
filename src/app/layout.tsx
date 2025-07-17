import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { WatchlistProvider } from '@/contexts/WatchlistContext';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';

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
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-body antialiased`}>
        <WatchlistProvider>
          <Header />
          <main>{children}</main>
          <Toaster />
        </WatchlistProvider>
      </body>
    </html>
  );
}
