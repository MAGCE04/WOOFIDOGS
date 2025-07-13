'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWoofiProgram, findPlatformPDA } from '@/utils/program';
import { Platform } from '@/types';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export default function Home() {
  const { connected } = useWallet();
  const program = useWoofiProgram();
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPlatformData = async () => {
      if (!program) return;
      
      try {
        setIsLoading(true);
        const [platformPDA] = findPlatformPDA();
        const platformData = await program.account.platform.fetch(platformPDA);
        setPlatform(platformData as unknown as Platform);
      } catch (error) {
        console.error('Error fetching platform data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (program) {
      fetchPlatformData();
    }
  }, [program]);

  const formatSOL = (lamports: bigint | undefined) => {
    if (!lamports) return '0.00';
    return (Number(lamports) / LAMPORTS_PER_SOL).toFixed(2);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Help Rescued Dogs Find Their Forever Home</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Support rescued dogs with SOL donations. Every contribution helps provide food, shelter, medical care, and love.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/dogs" className="btn bg-white text-primary-600 hover:bg-gray-100 font-semibold px-6 py-3">
              View Dogs
            </Link>
            {!connected && (
              <button className="btn bg-transparent border-2 border-white hover:bg-white/10 font-semibold px-6 py-3">
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center">
              <h3 className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                {isLoading ? '...' : platform?.dogCount || 0}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">Dogs Rescued</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center">
              <h3 className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                {isLoading ? '...' : formatSOL(platform?.totalDonations)}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">SOL Donated</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center">
              <h3 className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                {isLoading ? '...' : platform?.donationCount || 0}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">Total Donations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                At Woofi, we believe every dog deserves a loving home. Our mission is to rescue, rehabilitate, and rehome dogs in need, providing them with the care and support they require to thrive.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Through the power of blockchain technology, we're creating a transparent and efficient way for dog lovers to contribute directly to the care of specific dogs, seeing exactly how their donations make a difference.
              </p>
              <Link href="/about" className="btn btn-primary">
                Learn More
              </Link>
            </div>
            <div className="md:w-1/2 relative h-80 w-full rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b"
                alt="Happy dogs"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Connect Your Wallet</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Link your Solana wallet to our platform with just a few clicks.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Choose a Dog</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Browse through our rescued dogs and learn about their stories and needs.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Make a Donation</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Send SOL directly to support the dog of your choice. Track your impact on the blockchain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Your donation, no matter how small, can change a dog's life forever.
          </p>
          <Link href="/dogs" className="btn bg-white text-primary-600 hover:bg-gray-100 font-semibold px-6 py-3">
            Donate Now
          </Link>
        </div>
      </section>
    </Layout>
  );
}