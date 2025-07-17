'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

export interface TorrentSite {
  id: string;
  name: string;
  urlTemplate: string;
}

export interface TorrentKeyword {
  id: string;
  value: string;
  enabled: boolean;
}

interface TorrentSettingsContextType {
  sites: TorrentSite[];
  addSite: (name: string, urlTemplate: string) => void;
  removeSite: (id: string) => void;
  keywords: TorrentKeyword[];
  addKeyword: (value: string) => void;
  removeKeyword: (id: string) => void;
  toggleKeyword: (id: string) => void;
}

const SITES_KEY = 'torrent_sites';
const KEYWORDS_KEY = 'torrent_keywords';
const DEFAULT_SITES: TorrentSite[] = [
    { id: '1', name: '1337x', urlTemplate: 'https://1337x.to/search/{query}/1/' },
    { id: '2', name: 'The Pirate Bay', urlTemplate: 'https://thepiratebay.org/search.php?q={query}' },
];

const DEFAULT_KEYWORDS: TorrentKeyword[] = [
  { id: 'kw1', value: '2160p', enabled: true },
  { id: 'kw2', value: 'HDR', enabled: true },
  { id: 's01', value: 'S01', enabled: false },
  { id: 's02', value: 'S02', enabled: false },
  { id: 's03', value: 'S03', enabled: false },
  { id: 's04', value: 'S04', enabled: false },
  { id: 's05', value: 'S05', enabled: false },
  { id: 'e01', value: 'E01', enabled: false },
  { id: 'e02', value: 'E02', enabled: false },
  { id: 'e03', value: 'E03', enabled: false },
  { id: 'e04', value: 'E04', enabled: false },
  { id: 'e05', value: 'E05', enabled: false },
]

const TorrentSettingsContext = createContext<
  TorrentSettingsContextType | undefined
>(undefined);

export function TorrentSettingsProvider({ children }: { children: ReactNode }) {
  const [sites, setSites] = useState<TorrentSite[]>([]);
  const [keywords, setKeywords] = useState<TorrentKeyword[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedSites = localStorage.getItem(SITES_KEY);
      setSites(storedSites ? JSON.parse(storedSites) : DEFAULT_SITES);
      
      const storedKeywords = localStorage.getItem(KEYWORDS_KEY);
      if (storedKeywords) {
        const parsedKeywords = JSON.parse(storedKeywords);
        setKeywords(parsedKeywords.map((kw: any) => ({ ...kw, enabled: kw.enabled ?? true })));
      } else {
        setKeywords(DEFAULT_KEYWORDS);
      }

    } catch (error) {
      console.error('Failed to parse torrent settings from localStorage', error);
      setSites(DEFAULT_SITES);
      setKeywords(DEFAULT_KEYWORDS);
    }
    setLoading(false);
  }, []);

  const updateSitesStorage = (newSites: TorrentSite[]) => {
    setSites(newSites);
    localStorage.setItem(SITES_KEY, JSON.stringify(newSites));
  };

  const updateKeywordsStorage = (newKeywords: TorrentKeyword[]) => {
    setKeywords(newKeywords);
    localStorage.setItem(KEYWORDS_KEY, JSON.stringify(newKeywords));
  };

  const addSite = (name: string, urlTemplate: string) => {
    const newSite: TorrentSite = { id: crypto.randomUUID(), name, urlTemplate };
    updateSitesStorage([...sites, newSite]);
  };

  const removeSite = (id: string) => {
    updateSitesStorage(sites.filter((site) => site.id !== id));
  };

  const addKeyword = (value: string) => {
    if (keywords.some(k => k.value.toLowerCase() === value.toLowerCase())) return;
    const newKeyword: TorrentKeyword = { id: crypto.randomUUID(), value, enabled: true };
    updateKeywordsStorage([...keywords, newKeyword]);
  };

  const removeKeyword = (id: string) => {
    updateKeywordsStorage(keywords.filter((keyword) => keyword.id !== id));
  };

  const toggleKeyword = (id: string) => {
    const newKeywords = keywords.map(kw => kw.id === id ? { ...kw, enabled: !kw.enabled } : kw);
    updateKeywordsStorage(newKeywords);
  };

  if (loading) {
      return null;
  }

  return (
    <TorrentSettingsContext.Provider
      value={{
        sites,
        addSite,
        removeSite,
        keywords,
        addKeyword,
        removeKeyword,
        toggleKeyword,
      }}
    >
      {children}
    </TorrentSettingsContext.Provider>
  );
}

export function useTorrentSettings() {
  const context = useContext(TorrentSettingsContext);
  if (context === undefined) {
    throw new Error(
      'useTorrentSettings must be used within a TorrentSettingsProvider'
    );
  }
  return context;
}
