'use client';

import { useTorrentSettings } from '@/contexts/TorrentSettingsContext';
import { Button } from './ui/button';
import { ExternalLink } from 'lucide-react';

interface TorrentSearchProps {
  title: string;
  year: string | number;
}

export default function TorrentSearch({ title, year }: TorrentSearchProps) {
  const { sites, keywords } = useTorrentSettings();

  if (sites.length === 0) {
    return null;
  }

  const generateSearchUrl = (siteUrlTemplate: string) => {
    const keywordString = keywords.map(k => k.value).join(' ');
    const searchQuery = `${title} ${year} ${keywordString}`.trim();
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
