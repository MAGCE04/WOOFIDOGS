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

- Node.js 18.17.0+ and npm/yarn
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

#### Option 1: Deploy using Vercel Dashboard (Recommended)

1. Go to the Vercel dashboard and create a new project
2. Connect your GitHub repository
3. Configure the project with the following settings:
   - Framework Preset: Next.js
   - Root Directory: woofi-frontend
   - Build Command: npm run build
   - Output Directory: .next
   - Install Command: npm install
4. Click "Deploy"

#### Option 2: Deploy using Vercel CLI

1. Install the Vercel CLI: `npm install -g vercel`
2. Navigate to the project root: `cd DOGDONATION`
3. Run: `vercel --cwd woofi-frontend`
4. Follow the prompts to configure your deployment

### Troubleshooting Vercel Deployment

If you encounter issues with the Vercel deployment:

1. Make sure you're using Node.js 18.17.0 or later (check the "engines" field in package.json)
2. Ensure all dependencies are correctly specified in the woofi-frontend/package.json file
3. Try deploying only the woofi-frontend directory as a standalone project
4. Check Vercel logs for specific error messages

### Solana Program Deployment

The Solana program can be deployed to devnet or mainnet using Anchor CLI.

## License

MIT