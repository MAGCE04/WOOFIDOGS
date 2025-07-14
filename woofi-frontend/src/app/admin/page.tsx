'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWoofiProgram, findPlatformPDA } from '@/utils/program';
import { DogWithAddress, Platform } from '@/types';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import Image from 'next/image';
import toast from 'react-hot-toast';
import * as anchor from '@coral-xyz/anchor';

export default function AdminPage() {
  const { publicKey, connected } = useWallet();
  const program = useWoofiProgram();
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [dogs, setDogs] = useState<DogWithAddress[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0.1);
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);
  
  // New dog form state
  const [showAddDogForm, setShowAddDogForm] = useState<boolean>(false);
  const [newDog, setNewDog] = useState({
    name: '',
    age: 1,
    imageUrl: '',
    story: '',
    needsFood: false,
    needsToys: false,
    needsMedical: false,
    needsShelter: false,
    needsOther: ''
  });
  const [isAddingDog, setIsAddingDog] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!program || !publicKey) return;
      
      try {
        setIsLoading(true);
        
        // Fetch platform data
        const [platformPDA] = findPlatformPDA();
        const platformData = await program.account.platform.fetch(platformPDA);
        
        // Convert to our Platform type
        const typedPlatformData = {
          admin: new PublicKey((platformData as any).admin?.toString() || '11111111111111111111111111111111'),
          treasury: new PublicKey((platformData as any).treasury?.toString() || '11111111111111111111111111111111'),
          totalDonations: (platformData as any).totalDonations || BigInt(0),
          dogCount: (platformData as any).dogCount || 0,
          donationCount: (platformData as any).donationCount || 0
        } as Platform;
        
        setPlatform(typedPlatformData);
        
        // Check if current user is admin
        setIsAdmin(publicKey.equals(typedPlatformData.admin));
        
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

    if (program && publicKey) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [program, publicKey]);

  const formatSOL = (lamports: bigint | undefined) => {
    if (!lamports) return '0.00';
    return (Number(lamports) / LAMPORTS_PER_SOL).toFixed(2);
  };

  const handleWithdraw = async () => {
    if (!program || !publicKey || !platform) return;
    
    if (withdrawAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    try {
      setIsWithdrawing(true);
      const lamports = withdrawAmount * LAMPORTS_PER_SOL;
      
      // Get platform PDA
      const [platformPDA] = findPlatformPDA();
      
      await program.methods
        .withdrawFunds(new anchor.BN(lamports))
        .accounts({
          admin: publicKey,
          platform: platformPDA,
          treasury: platform.treasury,
          recipient: publicKey,
        })
        .rpc();
      
      toast.success(`Successfully withdrawn ${withdrawAmount} SOL`);
      setWithdrawAmount(0.1);
    } catch (error) {
      console.error('Error withdrawing funds:', error);
      toast.error('Failed to withdraw funds. Please try again.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleAddDog = async () => {
    if (!program || !publicKey || !platform) return;
    
    // Validate form
    if (!newDog.name.trim()) {
      toast.error('Dog name is required');
      return;
    }
    
    if (!newDog.imageUrl.trim()) {
      toast.error('Image URL is required');
      return;
    }
    
    if (!newDog.story.trim()) {
      toast.error('Story is required');
      return;
    }
    
    try {
      setIsAddingDog(true);
      
      // Get platform and dog PDAs
      const [platformPDA] = findPlatformPDA();
      // This is a placeholder - in a real app, you'd generate a proper dog PDA
      const dogPDA = PublicKey.findProgramAddressSync(
        [Buffer.from("dog"), publicKey.toBuffer(), Buffer.from(newDog.name)],
        program.programId
      )[0];
      
      await program.methods
        .addDog(
          newDog.name,
          newDog.age,
          newDog.imageUrl,
          newDog.story,
          newDog.needsFood,
          newDog.needsToys,
          newDog.needsMedical,
          newDog.needsShelter,
          newDog.needsOther
        )
        .accounts({
          admin: publicKey,
          platform: platformPDA,
          dog: dogPDA,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      
      toast.success(`Successfully added dog: ${newDog.name}`);
      setShowAddDogForm(false);
      
      // Reset form
      setNewDog({
        name: '',
        age: 1,
        imageUrl: '',
        story: '',
        needsFood: false,
        needsToys: false,
        needsMedical: false,
        needsShelter: false,
        needsOther: ''
      });
      
      // Refresh dogs list
      const allDogAccounts = await program.account.dog.all();
      const dogsWithAddress = allDogAccounts.map(account => ({
        ...account.account,
        address: account.publicKey
      })) as DogWithAddress[];
      
      setDogs(dogsWithAddress);
    } catch (error) {
      console.error('Error adding dog:', error);
      toast.error('Failed to add dog. Please try again.');
    } finally {
      setIsAddingDog(false);
    }
  };

  const handleUpdateDogStatus = async (dog: DogWithAddress, active: boolean) => {
    if (!program || !publicKey) return;
    
    try {
      await program.methods
        .updateDog(
          dog.imageUrl,
          dog.story,
          dog.needsFood,
          dog.needsToys,
          dog.needsMedical,
          dog.needsShelter,
          dog.needsOther,
          active
        )
        .accounts({
          admin: publicKey,
          dog: dog.address,
        })
        .rpc();
      
      toast.success(`Successfully ${active ? 'activated' : 'deactivated'} ${dog.name}`);
      
      // Update local state
      setDogs(dogs.map(d => 
        d.address.equals(dog.address) 
          ? { ...d, active } 
          : d
      ));
    } catch (error) {
      console.error('Error updating dog status:', error);
      toast.error('Failed to update dog status. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Admin Dashboard</h1>
        
        {!connected ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please connect your Solana wallet to access the admin dashboard.
            </p>
            <button className="btn btn-primary">
              Connect Wallet
            </button>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : !isAdmin ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Unauthorized</h2>
            <p className="text-gray-600 dark:text-gray-400">
              You do not have admin privileges to access this dashboard.
            </p>
          </div>
        ) : (
          <>
            {/* Platform Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Total Donations
                </h2>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {formatSOL(platform?.totalDonations)} SOL
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Dogs
                </h2>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {platform?.dogCount || 0}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Donation Count
                </h2>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {platform?.donationCount || 0}
                </p>
              </div>
            </div>
            
            {/* Withdraw Funds */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Withdraw Funds
              </h2>
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-grow">
                  <label htmlFor="withdrawAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Amount (SOL)
                  </label>
                  <input
                    id="withdrawAmount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(parseFloat(e.target.value))}
                    className="input w-full"
                  />
                </div>
                <button
                  onClick={handleWithdraw}
                  className="btn btn-primary"
                  disabled={isWithdrawing}
                >
                  {isWithdrawing ? 'Processing...' : 'Withdraw'}
                </button>
              </div>
            </div>
            
            {/* Manage Dogs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Manage Dogs
                </h2>
                <button
                  onClick={() => setShowAddDogForm(!showAddDogForm)}
                  className="btn btn-primary"
                >
                  {showAddDogForm ? 'Cancel' : 'Add Dog'}
                </button>
              </div>
              
              {showAddDogForm && (
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add New Dog</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="dogName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Name *
                      </label>
                      <input
                        id="dogName"
                        type="text"
                        value={newDog.name}
                        onChange={(e) => setNewDog({...newDog, name: e.target.value})}
                        className="input w-full"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="dogAge" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Age (years) *
                      </label>
                      <input
                        id="dogAge"
                        type="number"
                        min="0"
                        max="20"
                        value={newDog.age}
                        onChange={(e) => setNewDog({...newDog, age: parseInt(e.target.value)})}
                        className="input w-full"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="dogImageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Image URL *
                      </label>
                      <input
                        id="dogImageUrl"
                        type="text"
                        value={newDog.imageUrl}
                        onChange={(e) => setNewDog({...newDog, imageUrl: e.target.value})}
                        className="input w-full"
                        placeholder="https://example.com/dog.jpg"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="dogStory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Story *
                      </label>
                      <textarea
                        id="dogStory"
                        value={newDog.story}
                        onChange={(e) => setNewDog({...newDog, story: e.target.value})}
                        className="input w-full h-24"
                        required
                      />
                    </div>
                  </div>
                  
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Needs</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center">
                      <input
                        id="needsFood"
                        type="checkbox"
                        checked={newDog.needsFood}
                        onChange={(e) => setNewDog({...newDog, needsFood: e.target.checked})}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="needsFood" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Food
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="needsToys"
                        type="checkbox"
                        checked={newDog.needsToys}
                        onChange={(e) => setNewDog({...newDog, needsToys: e.target.checked})}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="needsToys" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Toys
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="needsMedical"
                        type="checkbox"
                        checked={newDog.needsMedical}
                        onChange={(e) => setNewDog({...newDog, needsMedical: e.target.checked})}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="needsMedical" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Medical
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="needsShelter"
                        type="checkbox"
                        checked={newDog.needsShelter}
                        onChange={(e) => setNewDog({...newDog, needsShelter: e.target.checked})}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="needsShelter" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Shelter
                      </label>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="needsOther" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Other Needs
                    </label>
                    <input
                      id="needsOther"
                      type="text"
                      value={newDog.needsOther}
                      onChange={(e) => setNewDog({...newDog, needsOther: e.target.value})}
                      className="input w-full"
                      placeholder="Training, special diet, etc."
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={handleAddDog}
                      className="btn btn-primary"
                      disabled={isAddingDog}
                    >
                      {isAddingDog ? 'Adding...' : 'Add Dog'}
                    </button>
                  </div>
                </div>
              )}
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Dog
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Age
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Needs
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Donations
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {dogs.map((dog) => (
                      <tr key={dog.address.toString()}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 relative">
                              <Image
                                src={dog.imageUrl || 'https://placedog.net/500/280'}
                                alt={dog.name}
                                fill
                                className="rounded-full object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {dog.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {dog.age} {dog.age === 1 ? 'year' : 'years'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {dog.needsFood && (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                Food
                              </span>
                            )}
                            {dog.needsToys && (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                Toys
                              </span>
                            )}
                            {dog.needsMedical && (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                Medical
                              </span>
                            )}
                            {dog.needsShelter && (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                Shelter
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {formatSOL(dog.totalDonations)} SOL
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            dog.active 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {dog.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleUpdateDogStatus(dog, !dog.active)}
                            className={`text-${dog.active ? 'red' : 'green'}-600 hover:text-${dog.active ? 'red' : 'green'}-900 dark:text-${dog.active ? 'red' : 'green'}-400 dark:hover:text-${dog.active ? 'red' : 'green'}-300`}
                          >
                            {dog.active ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}