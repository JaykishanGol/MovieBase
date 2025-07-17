
'use client';

import { useState } from 'react';
import { useWatchlist } from '@/contexts/WatchlistContext';
import { search } from '@/lib/tmdb';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CarouselItem, SearchResult } from '@/types';

interface ImportResult {
    successful: { title: string, importedTitle: string }[];
    failed: { title: string }[];
}

export default function ImportWatchlistPage() {
    const [jsonInput, setJsonInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [importResult, setImportResult] = useState<ImportResult | null>(null);
    const { addItem, watchlist } = useWatchlist();
    const { toast } = useToast();

    const handleImport = async () => {
        setIsProcessing(true);
        setImportResult(null);

        let titles: { title: string }[] = [];
        try {
            const parsedJson = JSON.parse(jsonInput);
            if (parsedJson.items && Array.isArray(parsedJson.items)) {
                 titles = parsedJson.items.filter((item: any) => item && typeof item.title === 'string');
            } else if (Array.isArray(parsedJson) && parsedJson.every(item => item && typeof item.title === 'string')) {
                titles = parsedJson.filter((item: any) => item && typeof item.title === 'string');
            } else {
                throw new Error('Invalid JSON format. Expected an object with an "items" array, or an array of objects with a "title" property.');
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Invalid JSON',
                description: (error as Error).message,
            });
            setIsProcessing(false);
            return;
        }

        const results: ImportResult = { successful: [], failed: [] };

        for (const item of titles) {
            try {
                // Skip if title already in watchlist to avoid redundant searches
                if (watchlist.some(watchlistItem => watchlistItem.title.toLowerCase() === item.title.toLowerCase())) {
                    continue;
                }
                
                // Don't process items with title 'Unknown Item' from Google's export
                if (item.title === 'Unknown Item') {
                    continue;
                }

                const searchResults = await search(item.title);
                const match = searchResults.results.find(
                    (r: SearchResult) => (r.media_type === 'movie' || r.media_type === 'tv') && r.poster_path
                );

                if (match) {
                    // Final check in watchlist by ID and media_type before adding
                    if (watchlist.some(watchlistItem => watchlistItem.id === match.id && watchlistItem.media_type === match.media_type)) {
                        continue;
                    }

                    const newItem: CarouselItem = {
                        id: match.id,
                        title: match.title || match.name || '',
                        media_type: match.media_type as 'movie' | 'tv',
                        poster_path: match.poster_path,
                        release_date: match.release_date || match.first_air_date || '',
                    };
                    addItem(newItem);
                    results.successful.push({ title: item.title, importedTitle: newItem.title });
                } else {
                    results.failed.push({ title: item.title });
                }
            } catch (error) {
                console.error(`Failed to process ${item.title}`, error);
                results.failed.push({ title: item.title });
            }
             // Add a small delay to avoid hitting API rate limits
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        setImportResult(results);
        toast({
            title: 'Import Complete',
            description: `${results.successful.length} items imported successfully.`,
        });
        setIsProcessing(false);
    };

    return (
        <div className="container py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Import Google Watchlist</CardTitle>
                    <CardDescription>
                        Paste the content of your Google Watchlist JSON file here. It supports an object with an "items" array (e.g., {"{ \"items\": [{\"title\": \"Movie Title\"}] }"}) or a direct array of items (e.g., [{"{ \"title\": \"Movie Title\" }"}]) .
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        placeholder='{ "items": [{ "title": "The Matrix" }, { "title": "Breaking Bad" }] }'
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        className="min-h-[200px] font-mono"
                        disabled={isProcessing}
                    />
                    <Button onClick={handleImport} disabled={isProcessing || !jsonInput}>
                        {isProcessing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                             <>
                                <UploadCloud className="mr-2 h-4 w-4" />
                                Import Watchlist
                             </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {importResult && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="text-green-500"/>
                                Successfully Imported ({importResult.successful.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ul className="space-y-2 text-sm text-muted-foreground max-h-96 overflow-y-auto">
                                {importResult.successful.map((item, index) => (
                                    <li key={index}>
                                        <span className="font-semibold text-foreground">{item.title}</span> (as "{item.importedTitle}")
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <XCircle className="text-red-500" />
                                Failed to Import ({importResult.failed.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground max-h-96 overflow-y-auto">
                                {importResult.failed.map((item, index) => (
                                    <li key={index}>{item.title}</li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
