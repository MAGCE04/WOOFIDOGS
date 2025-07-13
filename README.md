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

To deploy the frontend to Vercel, follow these steps:

1. Go to the Vercel dashboard and create a new project
2. Connect your GitHub repository
3. Configure the project with the following settings:
   - Framework Preset: Next.js
   - Root Directory: woofi-frontend
4. Click "Deploy"

If you're having issues with the deployment, make sure:
- The "Root Directory" is set to "woofi-frontend"
- The build command is set to "npm run build"
- The output directory is set to ".next"

### Solana Program Deployment

The Solana program can be deployed to devnet or mainnet using Anchor CLI.

## License

MIT