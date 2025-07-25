
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Supabase Setup

This project uses Supabase for authentication and database storage.

### 1. Set up Environment Variables

You need to create a `.env` file in the root of your project and add your Supabase project URL and anon key. You can find these in your Supabase project's API settings.

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

The application will handle creating the necessary tables in your database automatically if they don't exist.

### 2. Set up Auth Provider

This project uses email and password authentication. You should enable it in your Supabase project's "Authentication" -> "Providers" settings. You may also want to disable the "Confirm email" setting in "Authentication" -> "Settings" for easier local development.
