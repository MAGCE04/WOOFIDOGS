'use client';

import { FC } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Header: FC = () => {
  const { connected } = useWallet();

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            Woofi
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
              Home
            </Link>
            <Link href="/dogs" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
              Dogs
            </Link>
            <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
              About
            </Link>
            {connected && (
              <Link href="/donations" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                My Donations
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <WalletMultiButton className="!bg-primary-600 hover:!bg-primary-700" />
        </div>
      </div>
    </header>
  );
};

export default Header;