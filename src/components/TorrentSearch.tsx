'use client';

import { useTorrentSettings } from '@/contexts/TorrentSettingsContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import { Download, ExternalLink } from 'lucide-react';

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Search Torrents
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {sites.map((site) => (
          <DropdownMenuItem key={site.id} asChild>
            <a
              href={generateSearchUrl(site.urlTemplate)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-between w-full"
            >
              <span>{site.name}</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
