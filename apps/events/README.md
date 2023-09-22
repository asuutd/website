# Kazala (prev. ASU Events)

This website is built to allow organizations around the Dallas area ticket their events without the expensive fees of most ticketing services

## Contributing

To contribute, talk to an ASU officer so the technical director can add you as a collaborator. There is no barrier to entry. If you are a Typescript God or just finished CS1336, write up and issue or submit a pull request to get started.

### Installation

1. Clone the repository (Local)
   ```sh
   git clone https://github.com/asuutd/events_website.git
   ```
   If you don't have git, follow [this guide](https://github.com/git-guides/install-git)
   OR  
   [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/asuutd/events_website)
2. Fill up the environment variables from the .env.example [folder](https://github.com/asuutd/website/blob/master/README.md)

3. Run `npm run dev `
   > If this says npm doesn't exist,
   > [install node and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
4. Have fun. We probably messed something up

## Tech Stack

**Client:** React, TailwindCSS, React Query(tRPC)

**Server:** tRPC, NextJS, MySQL(PlanetScale)
