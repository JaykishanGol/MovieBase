'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useTorrentSettings } from '@/contexts/TorrentSettingsContext';
import { Trash2 } from 'lucide-react';

export default function TorrentKeywords() {
  const { keywords, removeKeyword, toggleKeyword } = useTorrentSettings();

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
                  <Label
                    htmlFor={`keyword-${keyword.id}`}
                    className="font-medium cursor-pointer"
                  >
                    {keyword.value}
                  </Label>
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
