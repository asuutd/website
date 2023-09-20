![Logo](https://images.utd-asu.com/Screenshot%202023-09-18%20170804.png)

# African Student Union (ASU) Monorepo

This is a monorepo based created using [**Turborepo**](https://turbo.build/repo/docs). It consists of two applications (Kazala and ASU).

## Setup Guide

Below is the adequate installation guide\
We assume you have NodeJS, NVM, and Git properly configured

1. We use pnpm as our package manager. Install it using the following link
   [PNPM Install Link](https://pnpm.io/installation)

2. Clone the repository using the following command

```bash
git clone https://github.com/asuutd/website.git
```

3. Install the dependencies `pnpm install`
4. Start the development server ` pnpm run dev`

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file. Either make your own or request access from admin developers. Sorry, we have a lot
of services we use here or there

```
VITE_PUBLIC_SUPABASE_URL=
VITE_PUBLIC_SUPABASE_ANON_KEY=
VITE_DATABASE_URL=
VITE_MAILCHAMP_API_KEY=
VITE_PUBLIC_STRIPE_PUBLISHABLE_KEY=
VITE_PUBLIC_URL="http://localhost:5173"

#Private
DB_URL=
AUTH_SECRET=
RESEND_API_KEY=
CALENDAR_API_KEY=
CALENDAR_ID=

#Kazala Envs
# Prisma
DATABASE_URL=

# Next Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL="http://localhost:3000"

# Next Auth Discord Provider


NEXT_PUBLIC_URL="http://localhost:3000"

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=

NEXT_PUBLIC_UPLOADCARE_PUB_KEY=

WEBHOOK_SECRET=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_GOOGLE_MAPS_KEY=

NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=
```

## Application Details

[**ASU Website**](https://github.com/asuutd/website/blob/master/apps/events/README.md)
[**Kazala**](https://github.com/asuutd/website/blob/master/apps/website/README.md)

# Contributing

When contributing to this repository, please first discuss the change you wish to make via Linear

Please note we have a code of conduct, please follow it in all your interactions with the project.

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a
   build.
2. Update the README.md with details of changes to the interface, this includes new environment
   variables, exposed ports, useful file locations and container parameters.
3. You may merge the Pull Request in once it has been approved by an admin developer

## Authors

- [@oluwapelps](https://www.github.com/Pelps12)
- [@jasonappah](https://github.com/jasonappah)
