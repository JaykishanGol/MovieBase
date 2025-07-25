-- This script contains the necessary SQL to set up the database schema for MovieBase.
--
-- To run this, go to your Supabase project's SQL Editor, paste the entire content of this file,
-- and click "Run". This will create the required tables and enable Row Level Security.
--
-- Make sure you have also configured your Authentication providers in the Supabase dashboard.
-- For this application, you need to enable the "Email" provider.

-- Create the table for watchlists
CREATE TABLE lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    is_deletable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, name)
);

-- Create the table for items within a watchlist
CREATE TABLE list_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    list_id UUID REFERENCES lists(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    media_id INTEGER NOT NULL,
    media_type TEXT NOT NULL,
    title TEXT NOT NULL,
    poster_path TEXT,
    release_date TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(list_id, media_id, media_type)
);

-- Create the table for user-defined torrent sites
CREATE TABLE torrent_sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    url_template TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create the table for user-defined torrent keywords
CREATE TABLE torrent_keywords (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, value)
);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE torrent_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE torrent_keywords ENABLE ROW LEVEL SECURITY;

-- Create policies for the 'lists' table
CREATE POLICY "Users can view their own lists" ON lists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own lists" ON lists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own lists" ON lists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own deletable lists" ON lists FOR DELETE USING (auth.uid() = user_id AND is_deletable = TRUE);

-- Create policies for the 'list_items' table
CREATE POLICY "Users can view their own list items" ON list_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own list items" ON list_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own list items" ON list_items FOR DELETE USING (auth.uid() = user_id);

-- Create policies for the 'torrent_sites' table
CREATE POLICY "Users can view their own torrent sites" ON torrent_sites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own torrent sites" ON torrent_sites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own torrent sites" ON torrent_sites FOR DELETE USING (auth.uid() = user_id);

-- Create policies for the 'torrent_keywords' table
CREATE POLICY "Users can view their own torrent keywords" ON torrent_keywords FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own torrent keywords" ON torrent_keywords FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own torrent keywords" ON torrent_keywords FOR DELETE USING (auth.uid() = user_id);
