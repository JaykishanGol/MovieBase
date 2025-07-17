'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetDescription,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Trash2, PlusCircle } from 'lucide-react';
import { useTorrentSettings } from '@/contexts/TorrentSettingsContext';

export default function TorrentSettings() {
  const { sites, addSite, removeSite, keywords, addKeyword, removeKeyword } =
    useTorrentSettings();

  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteUrl, setNewSiteUrl] = useState('');
  const [newKeyword, setNewKeyword] = useState('');

  const handleAddSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSiteName.trim() && newSiteUrl.trim().includes('{query}')) {
      addSite(newSiteName.trim(), newSiteUrl.trim());
      setNewSiteName('');
      setNewSiteUrl('');
    }
  };

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKeyword.trim()) {
      addKeyword(newKeyword.trim());
      setNewKeyword('');
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Torrent Settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Torrent Settings</SheetTitle>
          <SheetDescription>
            Manage your torrent sites and custom search keywords.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-8">
          {/* Site Management */}
          <div className="space-y-4">
            <h3 className="font-semibold">Torrent Sites</h3>
            <div className="space-y-2">
              {sites.map((site) => (
                <div
                  key={site.id}
                  className="flex items-center justify-between p-2 rounded-md bg-muted"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{site.name}</span>
                    <span className="text-xs text-muted-foreground">{site.urlTemplate}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSite(site.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddSite} className="space-y-3 p-3 border rounded-lg">
              <h4 className="font-medium text-sm">Add New Site</h4>
              <div className="space-y-1">
                <Label htmlFor="site-name">Site Name</Label>
                <Input
                  id="site-name"
                  value={newSiteName}
                  onChange={(e) => setNewSiteName(e.target.value)}
                  placeholder="e.g., 1337x"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="site-url">Search URL Template</Label>
                <Input
                  id="site-url"
                  value={newSiteUrl}
                  onChange={(e) => setNewSiteUrl(e.target.value)}
                  placeholder="e.g., https://1337x.to/search/{query}/1/"
                />
                 <p className="text-xs text-muted-foreground">Use {'{query}'} as a placeholder for the search term.</p>
              </div>
              <Button type="submit" className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Site
              </Button>
            </form>
          </div>

          {/* Keyword Management */}
          <div className="space-y-4">
            <h3 className="font-semibold">Search Keywords</h3>
             <div className="space-y-2">
              {keywords.map((keyword) => (
                <div
                  key={keyword.id}
                  className="flex items-center justify-between p-2 rounded-md bg-muted"
                >
                  <span className="font-medium">{keyword.value}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeKeyword(keyword.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddKeyword} className="space-y-2 p-3 border rounded-lg">
              <h4 className="font-medium text-sm">Add New Keyword</h4>
              <div>
                <Label htmlFor="keyword" className="sr-only">New Keyword</Label>
                <Input
                  id="keyword"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="e.g., HDR, 2160p"
                />
              </div>
              <Button type="submit" className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Keyword
              </Button>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
