
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

export interface TorrentSite {
  id: string;
  name: string;
  urlTemplate: string;
  user_id?: string;
}

export interface TorrentKeyword {
  id: string;
  value: string;
  user_id?: string;
}

interface TorrentSettingsContextType {
  sites: TorrentSite[];
  addSite: (name: string, urlTemplate: string) => Promise<void>;
  removeSite: (id: string) => Promise<void>;
  keywords: TorrentKeyword[];
  addKeyword: (value: string) => Promise<void>;
  removeKeyword: (id: string) => Promise<void>;
  loading: boolean;
}

const TorrentSettingsContext = createContext<
  TorrentSettingsContextType | undefined
>(undefined);

const DEFAULT_SITES: Omit<TorrentSite, 'id' | 'user_id'>[] = [
    { name: '1337x', urlTemplate: 'https://1337x.to/search/{query}/1/' },
    { name: 'The Pirate Bay', urlTemplate: 'https://thepiratebay.org/search.php?q={query}' },
    { name: 'uindex.org', urlTemplate: 'https://uindex.org/search.php?search={query}&c=0' },
    { name: 'bt4gprx', urlTemplate: 'https://bt4gprx.com/search?q={query}%20' },
    { name: '1tamilmv', urlTemplate: 'https://www.1tamilmv.tube/index.php?/search/&q={query}%20&quick=1' },
];

export function TorrentSettingsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [sites, setSites] = useState<TorrentSite[]>([]);
  const [keywords, setKeywords] = useState<TorrentKeyword[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    const defaultSites = DEFAULT_SITES.map(s => ({...s, id: `default-${s.name.replace(/\s/g, '')}`}));

    if (!user) {
        setSites(defaultSites);
        setKeywords([]);
        setLoading(false);
        return;
    }
    
    const { data: sitesData, error: sitesError } = await supabase
      .from('torrent_sites')
      .select('id, name, url_template, user_id')
      .eq('user_id', user.id);

    if (sitesError) console.error('Error fetching sites:', sitesError);

    const { data: keywordsData, error: keywordsError } = await supabase
        .from('torrent_keywords')
        .select('id, value, user_id')
        .eq('user_id', user.id);
    
    if (keywordsError) console.error('Error fetching keywords:', keywordsError);

    const userSites = sitesData ? sitesData.map(s => ({ ...s, urlTemplate: s.url_template })) : [];
    setSites([...defaultSites, ...userSites]);
    setKeywords(keywordsData || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const addSite = async (name: string, urlTemplate: string) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('torrent_sites')
      .insert({ name, url_template: urlTemplate, user_id: user.id })
      .select('id, name, url_template, user_id')
      .single();
    
    if (error) {
        console.error('Error adding site:', error);
    } else if (data) {
        setSites(prev => [...prev, {id: data.id, name: data.name, urlTemplate: data.url_template, user_id: data.user_id}]);
    }
  };

  const removeSite = async (id: string) => {
    if (!user || id.startsWith('default-')) return;
    const { error } = await supabase.from('torrent_sites').delete().eq('id', id);
    if (error) {
        console.error('Error removing site:', error);
    } else {
        setSites(prev => prev.filter((site) => site.id !== id));
    }
  };

  const addKeyword = async (value: string) => {
    if (!user) return;
    if (keywords.some(k => k.value.toLowerCase() === value.toLowerCase())) return;

    const { data, error } = await supabase
        .from('torrent_keywords')
        .insert({ value, user_id: user.id })
        .select()
        .single();
    
    if(error){
        console.error('Error adding keyword:', error);
    } else if (data) {
        setKeywords(prev => [...prev, data]);
    }
  };

  const removeKeyword = async (id: string) => {
    if (!user) return;
    const { error } = await supabase.from('torrent_keywords').delete().eq('id', id);
    if(error){
        console.error('Error removing keyword:', error);
    } else {
        setKeywords(prev => prev.filter((keyword) => keyword.id !== id));
    }
  };

  return (
    <TorrentSettingsContext.Provider
      value={{
        sites,
        addSite,
        removeSite,
        keywords,
        addKeyword,
        removeKeyword,
        loading,
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
