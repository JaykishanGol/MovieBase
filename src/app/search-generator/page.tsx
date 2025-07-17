'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTorrentSettings } from '@/contexts/TorrentSettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PlusCircle,
  Trash2,
  X,
  Search as SearchIcon,
  Link as LinkIcon,
} from 'lucide-react';
import { useState, useMemo } from 'react';

function SearchGenerator() {
  const searchParams = useSearchParams();
  const title = searchParams.get('title') || '';

  const {
    sites,
    addSite,
    removeSite,
    keywords,
    addKeyword,
    removeKeyword,
  } = useTorrentSettings();

  const [selectedSites, setSelectedSites] = useState<Set<string>>(new Set());
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(
    new Set()
  );
  const [newKeyword, setNewKeyword] = useState('');
  const [generatedUrls, setGeneratedUrls] = useState<
    { name: string; url: string }[]
  >([]);

  const defaultKeywords = useMemo(() => [
    'HD', '720p', '1080p', '2160p', 'HEVC', 'DV', 'HDR', '4k',
    'S01', 'E01', 'E02', 'E03', 'E04', 'E05', 'E06', 'E07', 'E08', 'E09', 'S02'
  ], []);

  const allKeywords = useMemo(() => {
    const combined = [...defaultKeywords, ...keywords.map(k => k.value)];
    return [...new Set(combined)]; // Unique keywords
  }, [keywords, defaultKeywords]);

  const toggleSite = (id: string) => {
    setSelectedSites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords((prev) => {
      const next = new Set(prev);
      if (next.has(keyword)) {
        next.delete(keyword);
      } else {
        next.add(keyword);
      }
      return next;
    });
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      addKeyword(newKeyword.trim());
      setNewKeyword('');
    }
  };

  const handleGenerateUrls = () => {
    const year = searchParams.get('year') || '';
    const selectedSitesData = sites.filter((site) => selectedSites.has(site.id));
    if (!title || selectedSitesData.length === 0) {
      setGeneratedUrls([]);
      return;
    }

    const keywordString = Array.from(selectedKeywords).join(' ');
    const searchQuery = `${title} ${year} ${keywordString}`
      .trim()
      .replace(/\s+/g, ' ');

    const urls = selectedSitesData.map((site) => ({
      name: site.name,
      url: site.urlTemplate.replace('{query}', encodeURIComponent(searchQuery)),
    }));
    setGeneratedUrls(urls);
  };

  return (
    <div className="container py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Generate Search URLs for: {title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Select Search Sites</h3>
            <div className="flex flex-wrap gap-2">
              {sites.map((site) => (
                <Button
                  key={site.id}
                  variant={selectedSites.has(site.id) ? 'default' : 'outline'}
                  onClick={() => toggleSite(site.id)}
                >
                  {site.name}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Custom Words</h3>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Add custom word"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
              />
              <Button onClick={handleAddKeyword} size="icon">
                <PlusCircle />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {allKeywords.map((keyword) => (
                <div
                  key={keyword}
                  className={`flex items-center gap-2 border rounded-full p-2 cursor-pointer ${
                    selectedKeywords.has(keyword)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted'
                  }`}
                  onClick={() => toggleKeyword(keyword)}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      selectedKeywords.has(keyword)
                        ? 'bg-primary-foreground border-primary-foreground'
                        : 'border-muted-foreground'
                    }`}
                  ></div>
                  <span>{keyword}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeKeyword(keywords.find(k => k.value === keyword)?.id || '');
                    }}
                    className="hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleGenerateUrls} size="lg" className="w-full">
            <SearchIcon className="mr-2" />
            Generate URLs
          </Button>

          {generatedUrls.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 mt-6">Generated URLs</h3>
              <div className="space-y-2">
                {generatedUrls.map((item) => (
                  <div key={item.name} className="flex items-center gap-4 p-2 bg-muted rounded-md">
                    <span className="font-medium flex-1">{item.name}</span>
                    <Button asChild variant="ghost" size="icon">
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                            <LinkIcon />
                        </a>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
          <CardHeader>
              <CardTitle>Saved Search Templates</CardTitle>
          </CardHeader>
          <CardContent>
             {/* This will be implemented in a future step */}
             <p className="text-muted-foreground">Manage your saved torrent sites here.</p>
          </CardContent>
      </Card>

    </div>
  );
}

export default function SearchGeneratorPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchGenerator />
        </Suspense>
    )
}
