# Woofi - Web3 Platform for Rescued Dogs

A platform to showcase rescued dogs and allow users to support them using SOL.

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

### Solana Program

The Solana program is located in the `woofi_program` directory. To build and deploy:

```bash
cd woofi_program
anchor build
anchor deploy
```

## License

MIT