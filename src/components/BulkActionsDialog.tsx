
'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { useWatchlist, Watchlist } from '@/contexts/WatchlistContext';
import { CarouselItem } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BulkActionsDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    sourceList: Watchlist;
    selectedItems: CarouselItem[];
    onActionComplete: () => void;
}

export default function BulkActionsDialog({ isOpen, onOpenChange, sourceList, selectedItems, onActionComplete }: BulkActionsDialogProps) {
    const { lists, bulkMoveItems } = useWatchlist();
    const [destinationListId, setDestinationListId] = useState<string>('');
    const [isMoving, setIsMoving] = useState(false);
    const { toast } = useToast();

    const availableLists = lists.filter(list => list.id !== sourceList.id);

    const handleMove = async () => {
        if (!destinationListId || selectedItems.length === 0) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Please select a destination list.',
            });
            return;
        }
        
        setIsMoving(true);
        await bulkMoveItems(sourceList.id, destinationListId, selectedItems);
        setIsMoving(false);
        onActionComplete();
        onOpenChange(false);
    };

    return (
         <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Move {selectedItems.length} items</DialogTitle>
                    <DialogDescription>
                        Select a destination list to move the selected items from "{sourceList.name}".
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                     <Select value={destinationListId} onValueChange={setDestinationListId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a destination list..." />
                        </SelectTrigger>
                        <SelectContent>
                            {availableLists.map(list => (
                                <SelectItem key={list.id} value={list.id}>
                                    {list.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleMove} disabled={isMoving || !destinationListId}>
                        {isMoving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Move Items
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
