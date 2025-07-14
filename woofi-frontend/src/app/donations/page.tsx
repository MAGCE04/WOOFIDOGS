'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWoofiProgram } from '@/utils/program';
import { Donation, DogWithAddress } from '@/types';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';

interface DonationWithDog extends Donation {
  dog: DogWithAddress | null;
  date: Date;
}

const DonationsPage = () => {
  const { publicKey, connected } = useWallet();
  const program = useWoofiProgram();
  const [donations, setDonations] = useState<DonationWithDog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalDonated, setTotalDonated] = useState<bigint>(BigInt(0));

  useEffect(() => {
    const fetchDonations = async () => {
      if (!program || !publicKey) return;
      
      try {
        setIsLoading(true);
        
        // Fetch all donations by the current user
        const donationAccounts = await program.account.donation.all([
          {
            memcmp: {
              offset: 8, // After the discriminator
              bytes: publicKey.toBase58()
            }
          }
        ]);
        
        // Fetch all dogs to match with donations
        const dogAccounts = await program.account.dog.all();
        const dogsMap = new Map(
          dogAccounts.map(account => [
            account.publicKey.toString(), 
            { ...account.account, address: account.publicKey } as DogWithAddress
          ])
        );
        
        // Process donations
        const processedDonations = donationAccounts.map(account => {
          const donation = account.account as unknown as Donation;
          const dog = dogsMap.get(donation.dogId.toString()) || null;
          const date = new Date(Number(donation.timestamp) * 1000);
          
          return {
            ...donation,
            dog,
            date
          };
        });
        
        // Sort by date (newest first)
        processedDonations.sort((a, b) => b.date.getTime() - a.date.getTime());
        
        setDonations(processedDonations);
        
        // Calculate total donated
        const total = processedDonations.reduce(
          (sum, donation) => sum + donation.amount,
          BigInt(0)
        );
        setTotalDonated(total);
      } catch (error) {
        console.error('Error fetching donations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (program && publicKey) {
      fetchDonations();
    } else {
      setIsLoading(false);
    }
  }, [program, publicKey]);

  const formatSOL = (lamports: bigint) => {
    return (Number(lamports) / LAMPORTS_PER_SOL).toFixed(2);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Mock data for development
  const mockDonations: DonationWithDog[] = [
    {
      donor: new PublicKey('11111111111111111111111111111111'),
      dogId: new PublicKey('11111111111111111111111111111111'),
      amount: BigInt(500000000),
      timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400),
      message: 'Hope this helps Max get some good food!',
      dog: {
        name: 'Max',
        age: 3,
        imageUrl: 'https://placedog.net/500/280?id=1',
        story: 'Max was found abandoned in a park.',
        needsFood: true,
        needsToys: true,
        needsMedical: false,
        needsShelter: false,
        needsOther: '',
        totalDonations: BigInt(1500000000),
        admin: new PublicKey('11111111111111111111111111111111'),
        active: true,
        address: new PublicKey('11111111111111111111111111111111')
      },
      date: new Date(Date.now() - 86400000)
    },
    {
      donor: new PublicKey('11111111111111111111111111111111'),
      dogId: new PublicKey('22222222222222222222222222222222'),
      amount: BigInt(1000000000),
      timestamp: BigInt(Math.floor(Date.now() / 1000) - 172800),
      message: 'For Bella\'s medical treatment',
      dog: {
        name: 'Bella',
        age: 2,
        imageUrl: 'https://placedog.net/500/280?id=2',
        story: 'Bella was rescued from a puppy mill.',
        needsFood: false,
        needsToys: false,
        needsMedical: true,
        needsShelter: true,
        needsOther: 'Training',
        totalDonations: BigInt(2200000000),
        admin: new PublicKey('11111111111111111111111111111111'),
        active: true,
        address: new PublicKey('22222222222222222222222222222222')
      },
      date: new Date(Date.now() - 172800000)
    }
  ];

  // Use mock data if no real data is available and not loading
  const displayDonations = !isLoading && donations.length === 0 && connected ? mockDonations : donations;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Donations</h1>
        
        {!connected ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please connect your Solana wallet to view your donation history.
            </p>
            <button className="btn btn-primary">
              Connect Wallet
            </button>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : displayDonations.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">No Donations Yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't made any donations yet. Start supporting rescued dogs today!
            </p>
            <Link href="/dogs" className="btn btn-primary">
              View Dogs
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Total Donated
              </h2>
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {formatSOL(totalDonated)} SOL
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Donation History
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {displayDonations.map((donation, index) => (
                  <div key={index} className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center">
                      {donation.dog && (
                        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                          <div className="relative h-16 w-16 rounded-full overflow-hidden">
                            <Image
                              src={donation.dog.imageUrl || 'https://placedog.net/500/280'}
                              alt={donation.dog.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {donation.dog ? `Donation to ${donation.dog.name}` : 'Donation'}
                          </h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(donation.date)}
                          </span>
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                          <p className="text-primary-600 dark:text-primary-400 font-medium">
                            {formatSOL(donation.amount)} SOL
                          </p>
                          {donation.message && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 md:mt-0 italic">
                              "{donation.message}"
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

// Export a dynamic component with no SSR
export default dynamic(() => Promise.resolve(DonationsPage), { ssr: false });