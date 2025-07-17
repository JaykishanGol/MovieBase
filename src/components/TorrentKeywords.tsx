'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, PlusCircle } from 'lucide-react';
import { useTorrentSettings } from '@/contexts/TorrentSettingsContext';
import { Checkbox } from '@/components/ui/checkbox';

export default function TorrentKeywords() {
  const { keywords, addKeyword, removeKeyword, toggleKeyword } = useTorrentSettings();
  const [newKeyword, setNewKeyword] = useState('');

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKeyword.trim()) {
      addKeyword(newKeyword.trim());
      setNewKeyword('');
    }
  };

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
                    <label htmlFor={`keyword-${keyword.id}`} className="font-medium cursor-pointer">
                        {keyword.value}
                    </label>
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
        <form onSubmit={handleAddKeyword} className="space-y-2 pt-4 border-t">
          <Label htmlFor="keyword">Add New Keyword</Label>
          <div className="flex gap-2">
            <Input
              id="keyword"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder="e.g., HDR, 2160p"
            />
            <Button type="submit" size="icon">
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
