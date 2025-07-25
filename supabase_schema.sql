-- Create lists table
CREATE TABLE lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  is_deletable BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add policy for lists
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own lists" ON lists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own lists" ON lists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own lists" ON lists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own deletable lists" ON lists FOR DELETE USING (auth.uid() = user_id AND is_deletable = TRUE);


-- Create list_items table
CREATE TABLE list_items (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  list_id UUID REFERENCES lists(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  media_id INTEGER NOT NULL,
  media_type TEXT NOT NULL,
  title TEXT NOT NULL,
  poster_path TEXT,
  release_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(list_id, media_id, media_type)
);

-- Add policy for list_items
ALTER TABLE list_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own list items" ON list_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own list items" ON list_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own list items" ON list_items FOR DELETE USING (auth.uid() = user_id);


-- Create torrent_sites table
CREATE TABLE torrent_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  url_template TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add policy for torrent_sites
ALTER TABLE torrent_sites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own torrent sites" ON torrent_sites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own torrent sites" ON torrent_sites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own torrent sites" ON torrent_sites FOR DELETE USING (auth.uid() = user_id);


-- Create torrent_keywords table
CREATE TABLE torrent_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  value TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add policy for torrent_keywords
ALTER TABLE torrent_keywords ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own torrent keywords" ON torrent_keywords FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own torrent keywords" ON torrent_keywords FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own torrent keywords" ON torrent_keywords FOR DELETE USING (auth.uid() = user_id);
