'use client';

import { FC } from 'react';
import Link from 'next/link';

const Footer: FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Woofi</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              A Web3 platform to showcase rescued dogs and allow users to support them using SOL.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dogs" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                  Dogs
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://twitter.com/woofi" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://discord.gg/woofi" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                  Discord
                </a>
              </li>
              <li>
                <a href="mailto:info@woofi.io" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-6 text-center text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Woofi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;