# ASU Events
This website is built to allow organizations on UTD run ticketing without the expensive fees of most ticketing services

### Contributing
To contribute, talk to an ASU officer so the technical director can add you as a collaborator. There is no barrier to entry. If you are a Rust God or just finished CS1336, write up and issue or submit a pull request to get started.
### Development
1. Clone the repository (Local)
    ```sh
    git clone https://github.com/asuutd/events_website.git
    ```
    If you don't have git, follow [this guide](https://github.com/git-guides/install-git)
    OR  
    [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/asuutd/events_website)

    
2. Fill up the environment variables (create a .env file in the root folder)
    ```
    DATABASE_URL="" 

    # Next Auth
    NEXTAUTH_SECRET=""
    NEXTAUTH_URL="http://localhost:3000"
    
    NEXT_PUBLIC_URL="http://localhost:3000"
    
    GOOGLE_CLIENT_ID=""
    GOOGLE_CLIENT_SECRET=""
    
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
    STRIPE_SECRET_KEY=""
    WEBHOOK_SECRET=""
    ```
- For DATABASE_URL, spin up a MySQL database on [Railway](https://railway.app/new)
- For NEXTAUTH_SECRET, generate a password. You can you [this](https://randomkeygen.com/)
- For GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET, follow  [this guide](https://support.google.com/cloud/answer/6158849?hl=en)
- For the STRIPE keys, the [Stripe docs](https://stripe.com/docs/keys) should be plenty
3. Run ```npm run dev ```
    > If this says npm doesn't exist, 
    > [install node and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
4. Have fun. I probably messed something up
