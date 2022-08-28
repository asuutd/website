# ASU UTDallas Website

This is the website for the African Student Union(ASU) at the University of Texas at Dallas. Feel free to tinker with it and submit pull requests.

## Setup Guide

1. Run `npm install`
2. Change all instances of `@prisma/client/edge` to `@prisma/client` (Required for local development)
3. Make a PostgreSQL database using [supabase](https://supabase.com)
4. Populate a new .env file with the following
   ```
   VITE_PUBLIC_SUPABASE_URL=
   VITE_PUBLIC_SUPABASE_ANON_KEY=
   DATABASE_URL=
   ```
   > These can be found in the API and Database settings in the supabase project page.
   > NOTE: Database URL (postgres://) and Supabase URL (https://) are different
5. Run `npx prisma generate `
6. Run `npm run dev`
