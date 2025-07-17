'use client';

import { useTorrentSettings } from '@/contexts/TorrentSettingsContext';
import { Button } from './ui/button';
import { ExternalLink } from 'lucide-react';

interface TorrentSearchProps {
  title: string;
  year: string | number;
}

export default function TorrentSearch({ title, year }: TorrentSearchProps) {
  const { sites, keywords, season, episode } = useTorrentSettings();

  if (sites.length === 0) {
    return null;
  }

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  const generateSearchUrl = (siteUrlTemplate: string) => {
    const enabledKeywords = keywords
      .filter(k => k.enabled)
      .map(k => {
        if (k.value === 'S') return `S${formatNumber(season)}`;
        if (k.value === 'E') return `E${formatNumber(episode)}`;
        return k.value;
      })
      .join(' ');
      
    const searchQuery = `${title} ${year} ${enabledKeywords}`.trim().replace(/\s+/g, ' ');
    return siteUrlTemplate.replace('{query}', encodeURIComponent(searchQuery));
  };

  return (
    <>
      {sites.map((site) => (
        <Button asChild key={site.id} variant="outline">
          <a
            href={generateSearchUrl(site.urlTemplate)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {site.name}
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      ))}
    </>
  );
}
