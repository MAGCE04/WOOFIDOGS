# Woofi - Web3 Platform for Rescued Dogs

A platform to showcase rescued dogs and allow users to support them using SOL.

## Project Structure

This is a monorepo containing:

- `woofi-frontend/` - Next.js frontend application
- `woofi_program/` - Solana smart contract (Anchor framework)

## Features

- Browse rescued dogs and their stories
- Donate SOL to support specific dogs
- Admin dashboard to manage dogs and withdrawals
- Track donation history and total funds raised

## Tech Stack

- Solana Blockchain (Anchor Framework)
- Next.js with TypeScript
- TailwindCSS for styling
- Wallet adapters for Solana wallets

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Solana CLI tools
- Phantom wallet or other Solana wallet

### Frontend Development

```bash
cd woofi-frontend
npm install
npm run dev
```

The frontend will be available at http://localhost:3000

### Solana Program Development

The Solana program is located in the `woofi_program` directory. To build and deploy:

```bash
cd woofi_program
anchor build
anchor deploy
```

## Deployment

### Frontend Deployment (Vercel)

The frontend is configured for deployment on Vercel. The `vercel.json` file in the root directory configures Vercel to:
- Run the install command in the woofi-frontend directory
- Build the Next.js app from the woofi-frontend directory
- Use the correct output directory for the build artifacts

### Solana Program Deployment

The Solana program can be deployed to devnet or mainnet using Anchor CLI.

## License

MIT