
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

// Function to clean up common JSON errors
function cleanJsonString(jsonString: string): string {
    return jsonString
        // Remove trailing commas from objects
        .replace(/,\s*}/g, '}')
        // Remove trailing commas from arrays
        .replace(/,\s*]/g, ']')
        // Remove other stray characters that might invalidate JSON (like the user's backslash)
        .replace(/\\/g, '')
        // Trim whitespace
        .trim();
}

function parseCsv(csvString: string): { title: string }[] {
    const titles: { title: string }[] = [];
    const lines = csvString.split('\n');

    // Find header line
    const headerIndex = lines.findIndex(line => line.toLowerCase().includes('title'));
    if (headerIndex === -1) {
        // Fallback for no header: assume first column is title
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;
            const title = trimmedLine.split(',')[0].replace(/"/g, '').trim();
            if (title) {
                titles.push({ title });
            }
        }
        return titles;
    }
    
    const contentLines = lines.slice(headerIndex + 1);

    for (const line of contentLines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        let title;
        if (trimmedLine.startsWith('"')) {
            // Handle quoted titles that may contain commas
            const closingQuoteIndex = trimmedLine.indexOf('"', 1);
            if (closingQuoteIndex > 0) {
                title = trimmedLine.substring(1, closingQuoteIndex);
            }
        } else {
            // Handle unquoted titles
            const commaIndex = trimmedLine.indexOf(',');
            if (commaIndex !== -1) {
                title = trimmedLine.substring(0, commaIndex);
            } else {
                title = trimmedLine; // Assume the whole line is the title if no comma
            }
        }

        if (title) {
            titles.push({ title: title.trim() });
        }
    }
    return titles;
}


export default function ImportWatchlistPage() {
    const [textInput, setTextInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [importResult, setImportResult] = useState<ImportResult | null>(null);
    const { addItems, watchlist } = useWatchlist();
    const { toast } = useToast();

    const handleImport = async () => {
        setIsProcessing(true);
        setImportResult(null);

        let titles: { title: string }[] = [];
        const trimmedInput = textInput.trim();

        try {
            if (trimmedInput.startsWith('{') || trimmedInput.startsWith('[')) {
                // Assume JSON
                const cleanedJsonInput = cleanJsonString(trimmedInput);
                const parsedJson = JSON.parse(cleanedJsonInput);

                if (parsedJson.items && Array.isArray(parsedJson.items)) {
                     titles = parsedJson.items.filter((item: any) => item && typeof item.title === 'string');
                } else if (Array.isArray(parsedJson)) {
                    titles = parsedJson.filter((item: any) => item && typeof item.title === 'string');
                } else {
                    throw new Error('Invalid JSON format. Expected an object with an "items" array, or an array of objects with a "title" property.');
                }
            } else {
                // Assume CSV
                titles = parseCsv(trimmedInput);
                if (titles.length === 0) {
                    throw new Error('Could not parse any titles from the CSV data. Please check the format.');
                }
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Invalid Input',
                description: 'Please check the format of your data. ' + (error as Error).message,
            });
            setIsProcessing(false);
            return;
        }

        const results: ImportResult = { successful: [], failed: [] };
        
        const searchPromises = titles.map(item => 
            search(item.title)
                .then(searchResults => ({ title: item.title, searchResults }))
                .catch(error => {
                    console.error(`Failed to search for title "${item.title}":`, error);
                    return { title: item.title, searchResults: null }; // Gracefully handle individual search failures
                })
        );
        
        const settledResults = await Promise.all(searchPromises);
        
        const newItems: CarouselItem[] = [];
        const existingItemIds = new Set(watchlist.map(item => `${item.media_type}-${item.id}`));

        settledResults.forEach(result => {
            if (!result || !result.searchResults) {
                if (result) results.failed.push({ title: result.title });
                return;
            }

            const { title, searchResults } = result;

            const match = searchResults.results.find(
                (r: SearchResult) => (r.media_type === 'movie' || r.media_type === 'tv') && r.poster_path
            );

            if (match) {
                const newItem: CarouselItem = {
                    id: match.id,
                    title: match.title || match.name || '',
                    media_type: match.media_type as 'movie' | 'tv',
                    poster_path: match.poster_path,
                    release_date: match.release_date || match.first_air_date || '',
                };

                const uniqueId = `${newItem.media_type}-${newItem.id}`;

                if (!existingItemIds.has(uniqueId)) {
                    newItems.push(newItem);
                    existingItemIds.add(uniqueId);
                    results.successful.push({ title, importedTitle: newItem.title });
                }
            } else {
                results.failed.push({ title });
            }
        });
        
        if (newItems.length > 0) {
            addItems(newItems);
        }
        
        setImportResult(results);
        toast({
            title: 'Import Complete',
            description: `${results.successful.length} items added to "My Watchlist".`,
        });
        setIsProcessing(false);
    };

    return (
        <div className="container py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Import Watchlist</CardTitle>
                    <CardDescription>
                        Paste the content of your Google Watchlist JSON or CSV file here. The page will automatically detect the format and add items to your "My Watchlist".
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        placeholder='Paste JSON or CSV content here...'
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        className="min-h-[200px] font-mono"
                        disabled={isProcessing}
                    />
                    <Button onClick={handleImport} disabled={isProcessing || !textInput}>
                        {isProcessing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                             <>
                                <UploadCloud className="mr-2 h-4 w-4" />
                                Import to "My Watchlist"
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
