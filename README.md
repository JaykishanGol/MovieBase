
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Supabase Setup

This project uses Supabase for authentication and database storage.

### 1. Set up Environment Variables

You need to create a `.env.local` file in the root of your project and add your Supabase project URL and anon key. You can find these in your Supabase project's API settings.

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 2. Set up Database Tables

You need to create the required tables in your Supabase database. Go to the "SQL Editor" in your Supabase dashboard and run the SQL commands from the `supabase_schema.sql` file in the root of this project. This will create the `profiles`, `lists`, `list_items`, `torrent_sites`, and `torrent_keywords` tables.

### 3. Set up Auth Provider

This project uses email and password authentication. You should enable it in your Supabase project's "Authentication" -> "Providers" settings. You may also want to disable the "Confirm email" setting in "Authentication" -> "Settings" for easier local development.

