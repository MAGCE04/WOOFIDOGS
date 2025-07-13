# Woofi Frontend

This is the frontend application for the Woofi platform, a Web3 platform to showcase rescued dogs and allow users to support them using SOL.

## Features

- Browse rescued dogs and their stories
- Filter dogs by their needs (food, toys, medical, shelter)
- Connect Solana wallet (Phantom, Solflare, etc.)
- Donate SOL to specific dogs
- View donation history
- Admin dashboard for managing dogs and withdrawing funds

## Tech Stack

- Next.js 13 with App Router
- TypeScript
- TailwindCSS for styling
- Solana Web3.js and Anchor for blockchain interactions
- Wallet Adapter for Solana wallet connections

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- A Solana wallet (Phantom, Solflare, etc.)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```
3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_WOOFI_PROGRAM_ID=CpPKTheeec2m2WMMsSg6ykyhRUu8FVcpUpoo1QvrNHmN
```

## Deployment on Vercel

The easiest way to deploy the app is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to a Git repository (GitHub, GitLab, BitBucket)
2. Import the project to Vercel
3. Add the environment variables
4. Deploy

## Project Structure

- `/src/app` - Next.js app router pages
- `/src/components` - Reusable React components
- `/src/context` - React context providers
- `/src/utils` - Utility functions
- `/src/types` - TypeScript type definitions
- `/src/idl` - Anchor IDL for the Woofi program

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT