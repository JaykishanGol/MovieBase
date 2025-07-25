
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Supabase Setup

This project uses Supabase for authentication and database storage. To get it working, you need to follow these steps.

### 1. Create a Supabase Project

If you haven't already, create a new project on [Supabase](https://supabase.com/).

### 2. Set up Environment Variables

You need to create a `.env` file in the root of your project and add your Supabase project URL and anon key. You can find these in your Supabase project's "Project Settings" > "API" section.

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Configure Authentication

This project uses email and password authentication. 

1. Go to your Supabase project dashboard.
2. Navigate to the "Authentication" section.
3. In the "Providers" tab, ensure that **Email** is enabled.
4. For easier local development, you might want to go to the "Settings" tab and disable **Confirm email**.

### 4. Set up the Database Schema

You need to create the necessary tables in your database for the application to function correctly.

1. Go to your Supabase project dashboard.
2. Navigate to the **SQL Editor**.
3. Click **New query**.
4. Copy the entire content of the `supabase_schema.sql` file from this project.
5. Paste the SQL into the editor and click **Run**.

This will create the `lists`, `list_items`, `torrent_sites`, and `torrent_keywords` tables and enable Row Level Security policies to ensure users can only access their own data.

## Deployment to Netlify

To deploy this project to Netlify, follow these steps:

1.  **Push to a Git Repository**: Make sure your project is on GitHub, GitLab, or Bitbucket.

2.  **Create a New Site on Netlify**:
    *   Log in to your Netlify account.
    *   Click "Add new site" and choose "Import an existing project".
    *   Connect to your Git provider and select the repository for this project.

3.  **Configure Build Settings**:
    *   Netlify should automatically detect that this is a Next.js project and set the build command to `next build` and the publish directory to `.next/`. The `netlify.toml` file in this project already configures this for you.

4.  **Add Environment Variables**: This is the most important step.
    *   In your Netlify site's dashboard, go to "Site configuration" > "Build & deploy" > "Environment".
    *   Click "Edit variables" and add the following keys and their corresponding values:
        *   `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
        *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key.
        *   `NEXT_PUBLIC_TMDB_API_KEY`: Your TMDB API key.

5.  **Deploy**:
    *   Click "Deploy site". Netlify will start the build process and deploy your application.
