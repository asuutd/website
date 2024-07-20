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

### Setting up Apple Wallet generation

_Adapted from https://github.com/alexandercerutti/passkit-generator/wiki/Generating-Certificates and https://developer.apple.com/documentation/walletpasses/building_a_pass._

**Note:** These commands were run successfully on a macOS system but should work correctly under any Unix-based system with the `base64` and `openssl` utilities available. On Windows, it will be **easiest to use Git Bash** (bundled with the [Windows installer for Git](https://git-scm.com/download/win)) as it includes all the necessary utilities.

Follow all the steps from [this guide](https://github.com/alexandercerutti/passkit-generator/wiki/Generating-Certificates#ready-set-steps) to set up necessary certificates, then return back here to get environment variables setup.

When following the steps in the above guide, skip any step that mentions downloading the WWDR key. This is already included with the library we're using to generate passes.

Set the `APPLE_TICKET_PASS_TYPE_IDENTIFIER` environment variable in `.env` to the pass type identifier (example: `pass.com.mycompany.event`) you set up in the Apple Developer Portal.

#### Last steps: macOS

At this point, you should have these files and passwords created:

- `signerCert.pem`
  - Run `base64 -i signerCert.pem -o -`.
  - Set the `APPLE_PASS_CERTIFICATE` environment variable in `.env` to this output.
- password for `signerCert.pem`
  - Set the `APPLE_PASS_CERTIFICATE_PASSWORD` environment variable in `.env` to the password.
- `signerKey.pem`
  - Run `base64 -i signerKey.pem -o -`.
  - Set the `APPLE_PASS_PRIVATE_KEY` environment variable in `.env` to this output.
- passphrase for `signerKey.pem`
  - Set the `APPLE_PASS_PRIVATE_KEY_PASSPHRASE` environment variable in `.env` to the - passphrase for `signerKey.pem`
    .

#### Last steps: Other platforms

At this point, you should have these files created:

- `<your-key-name>.key`
  - - Run `base64 -i <your-key-name>.key -o -`.
  - Set the `APPLE_PASS_PRIVATE_KEY` environment variable in `.env` to this output.
- `signerCert.pem`
  - Run `base64 -i signerCert.pem -o -`.
  - Set the `APPLE_PASS_CERTIFICATE` environment variable in `.env` to this output.
