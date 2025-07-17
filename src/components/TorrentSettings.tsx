'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet';
import { Settings, Trash2 } from 'lucide-react';
import { useTorrentSettings } from '@/contexts/TorrentSettingsContext';

export default function TorrentSettings() {
  const { sites, removeSite } = useTorrentSettings();

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
          <SheetTitle>Torrent Site Settings</SheetTitle>
          <SheetDescription>
            Manage your saved torrent sites. Add new sites on the Search Generator page.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-8">
          <div className="space-y-4">
            <h3 className="font-semibold">Your Saved Torrent Sites</h3>
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
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
