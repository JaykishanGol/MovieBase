# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Deploying to Render

To deploy this project to Render, follow these steps:

1.  **Push to a GitHub Repository:** Make sure your code is pushed to a GitHub repository.

2.  **Create a New Web Service on Render:**
    *   Go to your [Render Dashboard](https://dashboard.render.com/).
    *   Click **"New +"** and select **"Web Service"**.
    *   Connect your GitHub account and select your repository.

3.  **Configure the Service:**
    *   **Name:** Give your service a name (e.g., `moviebase-app`).
    *   **Root Directory:** Leave this as is.
    *   **Environment:** Select `Node`.
    *   **Build Command:** `npm install && npm run build`
    *   **Start Command:** `npm start`

4.  **Add the Environment Variable:**
    *   Scroll down to the **"Environment"** section.
    *   Click **"Add Environment Variable"**.
    *   **Key:** `NEXT_PUBLIC_TMDB_API_KEY`
    *   **Value:** `10069c04fb7414dd0a7683abb054c50b` (This is the public key you've been using).

5.  **Deploy:**
    *   Click **"Create Web Service"**. Render will automatically build and deploy your application.

Your app will be live at the URL provided by Render once the deployment is complete.
