'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useTorrentSettings } from '@/contexts/TorrentSettingsContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from './ui/label';

export default function TorrentKeywords() {
  const {
    keywords,
    removeKeyword,
    toggleKeyword,
    season,
    setSeason,
    episode,
    setEpisode,
  } = useTorrentSettings();

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-2">Custom Search Keywords</h3>
      <div className="space-y-4 p-4 border rounded-lg">
        <div className="space-y-2">
          {keywords.length > 0 ? (
            keywords.map((keyword) => (
              <div
                key={keyword.id}
                className="flex items-center justify-between p-2 rounded-md bg-muted"
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`keyword-${keyword.id}`}
                    checked={keyword.enabled}
                    onCheckedChange={() => toggleKeyword(keyword.id)}
                  />
                  {keyword.value === 'S' ? (
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`keyword-${keyword.id}`} className="font-medium cursor-pointer">
                        Season
                      </Label>
                      <Input
                        type="number"
                        id="season-input"
                        value={season}
                        onChange={(e) => setSeason(parseInt(e.target.value, 10) || 1)}
                        className="w-20 h-8"
                        min="1"
                      />
                    </div>
                  ) : keyword.value === 'E' ? (
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`keyword-${keyword.id}`} className="font-medium cursor-pointer">
                        Episode
                      </Label>
                      <Input
                        type="number"
                        id="episode-input"
                        value={episode}
                        onChange={(e) => setEpisode(parseInt(e.target.value, 10) || 1)}
                        className="w-20 h-8"
                        min="1"
                      />
                    </div>
                  ) : (
                    <label htmlFor={`keyword-${keyword.id}`} className="font-medium cursor-pointer">
                      {keyword.value}
                    </label>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeKeyword(keyword.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No custom keywords added yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
