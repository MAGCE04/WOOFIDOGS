'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import DogCard from '@/components/DogCard';
import { useWoofiProgram, findPlatformPDA } from '@/utils/program';
import { DogWithAddress, Platform } from '@/types';
import { PublicKey } from '@solana/web3.js';
import dynamic from 'next/dynamic';

// Dynamically import the page with no SSR to prevent Solana code from running during build
const DogsPage = () => {
  const program = useWoofiProgram();
  const [dogs, setDogs] = useState<DogWithAddress[]>([]);
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      if (!program) return;
      
      try {
        setIsLoading(true);
        
        // Fetch platform data
        const [platformPDA] = findPlatformPDA();
        const platformData = await program.account.platform.fetch(platformPDA);
        setPlatform(platformData as unknown as Platform);
        
        // Fetch all dogs
        const allDogAccounts = await program.account.dog.all();
        const dogsWithAddress = allDogAccounts.map(account => ({
          ...account.account,
          address: account.publicKey
        })) as DogWithAddress[];
        
        setDogs(dogsWithAddress);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (program) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [program]);

  const filteredDogs = dogs.filter(dog => {
    if (!dog.active) return false;
    if (filter === 'all') return true;
    if (filter === 'food' && dog.needsFood) return true;
    if (filter === 'toys' && dog.needsToys) return true;
    if (filter === 'medical' && dog.needsMedical) return true;
    if (filter === 'shelter' && dog.needsShelter) return true;
    return false;
  });

  const refreshData = async () => {
    if (!program) return;
    
    try {
      // Fetch all dogs
      const allDogAccounts = await program.account.dog.all();
      const dogsWithAddress = allDogAccounts.map(account => ({
        ...account.account,
        address: account.publicKey
      })) as DogWithAddress[];
      
      setDogs(dogsWithAddress);
      
      // Refresh platform data
      const [platformPDA] = findPlatformPDA();
      const platformData = await program.account.platform.fetch(platformPDA);
      setPlatform(platformData as unknown as Platform);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  // Mock data for development
  const mockDogs: DogWithAddress[] = [
    {
      name: 'Max',
      age: 3,
      imageUrl: 'https://placedog.net/500/280?id=1',
      story: 'Max was found abandoned in a park. He\'s very friendly and loves to play fetch.',
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
    {
      name: 'Bella',
      age: 2,
      imageUrl: 'https://placedog.net/500/280?id=2',
      story: 'Bella was rescued from a puppy mill. She\'s shy but very sweet once she trusts you.',
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
    {
      name: 'Charlie',
      age: 5,
      imageUrl: 'https://placedog.net/500/280?id=3',
      story: 'Charlie was found as a stray with a broken leg. After surgery, he\'s recovering well but needs ongoing care.',
      needsFood: true,
      needsToys: false,
      needsMedical: true,
      needsShelter: false,
      needsOther: '',
      totalDonations: BigInt(3100000000),
      admin: new PublicKey('11111111111111111111111111111111'),
      active: true,
      address: new PublicKey('33333333333333333333333333333333')
    }
  ];

  // Use mock data if no real data is available
  const displayDogs = dogs.length > 0 ? filteredDogs : mockDogs;
  const treasuryAddress = platform?.treasury || new PublicKey('11111111111111111111111111111111');

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dogs Needing Your Support</h1>
        
        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
            >
              All Dogs
            </button>
            <button
              onClick={() => setFilter('food')}
              className={`btn ${filter === 'food' ? 'btn-primary' : 'btn-outline'}`}
            >
              Needs Food
            </button>
            <button
              onClick={() => setFilter('toys')}
              className={`btn ${filter === 'toys' ? 'btn-primary' : 'btn-outline'}`}
            >
              Needs Toys
            </button>
            <button
              onClick={() => setFilter('medical')}
              className={`btn ${filter === 'medical' ? 'btn-primary' : 'btn-outline'}`}
            >
              Needs Medical Care
            </button>
            <button
              onClick={() => setFilter('shelter')}
              className={`btn ${filter === 'shelter' ? 'btn-primary' : 'btn-outline'}`}
            >
              Needs Shelter
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : displayDogs.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No dogs found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              There are no dogs matching your current filter. Please try another filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayDogs.map((dog) => (
              <DogCard 
                key={dog.address.toString()} 
                dog={dog} 
                treasuryAddress={treasuryAddress}
                onDonationSuccess={refreshData}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

// Export a dynamic component with no SSR
export default dynamic(() => Promise.resolve(DogsPage), { ssr: false });