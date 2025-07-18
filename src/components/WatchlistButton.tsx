
'use client';

import { Plus, Loader2, Check, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { useWatchlist } from '@/contexts/WatchlistContext';
import { useToast } from '@/hooks/use-toast';
import { CarouselItem } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { useState } from 'react';
import { Input } from './ui/input';

interface WatchlistButtonProps {
  item: CarouselItem;
}

export default function WatchlistButton({ item }: WatchlistButtonProps) {
  const { lists, addItemToLists, createList } = useWatchlist();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedLists, setSelectedLists] = useState<Set<string>>(new Set());
  const [newListName, setNewListName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      // When dialog opens, pre-select lists the item is already in
      const currentItemLists = new Set<string>();
      lists.forEach(list => {
        if (list.items.some(i => i.id === item.id && i.media_type === item.media_type)) {
          currentItemLists.add(list.id);
        }
      });
      setSelectedLists(currentItemLists);
    }
    setOpen(isOpen);
  };

  const handleCheckboxChange = (listId: string, checked: boolean) => {
    setSelectedLists(prev => {
      const next = new Set(prev);
      if (checked) {
        next.add(listId);
      } else {
        next.delete(listId);
      }
      return next;
    });
  };

  const handleSave = () => {
    addItemToLists(item, Array.from(selectedLists));
    toast({
      description: `Updated lists for "${item.title}".`,
    });
    setOpen(false);
  };
  
  const handleCreateList = async () => {
    if (!newListName.trim()) return;
    setIsCreating(true);
    try {
        const newList = await createList(newListName.trim());
        setSelectedLists(prev => new Set(prev).add(newList.id));
        setNewListName('');
    } catch(e) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'A list with this name already exists.',
        });
    } finally {
        setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="bg-black/50 hover:bg-black/70 text-white rounded-full"
            >
              <Plus className="h-5 w-5" />
              <span className="sr-only">Add to a list</span>
            </Button>
        </DialogTrigger>
        <DialogContent 
            className="sm:max-w-[425px]"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onPointerDownOutside={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
            <DialogHeader>
                <DialogTitle>Add "{item.title}" to...</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2">
                    {lists.map(list => (
                        <div key={list.id} className="flex items-center space-x-2">
                             <Checkbox 
                                id={`list-${list.id}`} 
                                checked={selectedLists.has(list.id)}
                                onCheckedChange={(checked) => handleCheckboxChange(list.id, !!checked)}
                            />
                            <Label htmlFor={`list-${list.id}`} className="cursor-pointer">{list.name}</Label>
                        </div>
                    ))}
                </div>
                 <div className="flex w-full max-w-sm items-center space-x-2 pt-4 border-t">
                    <Input 
                        type="text" 
                        placeholder="New list name..." 
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateList()}
                        disabled={isCreating}
                    />
                    <Button type="button" onClick={handleCreateList} disabled={isCreating || !newListName.trim()}>
                        {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                        <span className="sr-only">Create List</span>
                    </Button>
                </div>
            </div>
            <DialogFooter>
                 <DialogClose asChild>
                    <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <Button onClick={handleSave}><Check className="mr-2 h-4 w-4" /> Save</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}
