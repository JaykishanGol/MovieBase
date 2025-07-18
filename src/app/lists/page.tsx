
'use client';

import { useState } from 'react';
import { useWatchlist } from '@/contexts/WatchlistContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Plus, Trash2, List } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function ListsPage() {
    const { lists, loading, createList, deleteList } = useWatchlist();
    const [newListName, setNewListName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const { toast } = useToast();

    const handleCreateList = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newListName.trim()) return;
        setIsCreating(true);
        try {
            await createList(newListName.trim());
            setNewListName('');
            toast({ description: `Created list "${newListName.trim()}".` });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'A list with this name already exists.',
            });
        } finally {
            setIsCreating(false);
        }
    };
    
    if (loading) {
        return (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        );
    }

    return (
        <div className="container py-8 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Create a New List</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreateList} className="flex w-full max-w-sm items-center space-x-2">
                         <Input 
                            type="text" 
                            placeholder="My awesome list..." 
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            disabled={isCreating}
                        />
                        <Button type="submit" disabled={isCreating || !newListName.trim()}>
                            {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                            Create
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-4">
                 <h2 className="text-2xl font-bold font-headline">My Lists</h2>
                 {lists.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {lists.map(list => (
                            <Card key={list.id} className="flex flex-col">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-xl">
                                        <Link href={`/list/${list.id}`} className="hover:underline">
                                            {list.name}
                                        </Link>
                                    </CardTitle>
                                    {list.isDeletable && (
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => deleteList(list.id)}
                                            className="h-8 w-8"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete list</span>
                                        </Button>
                                    )}
                                </CardHeader>
                                <CardContent className="flex-grow flex items-end">
                                    <p className="text-muted-foreground">{list.items.length} item(s)</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                 ) : (
                    <div className="text-center text-muted-foreground py-16">
                        <List className="mx-auto h-12 w-12" />
                        <p className="mt-4 text-lg">You don't have any lists yet.</p>
                        <p>Create one above to get started!</p>
                    </div>
                 )}
            </div>
        </div>
    );
}
