'use client';

import { FC, useState } from 'react';
import Image from 'next/image';
import { DogWithAddress } from '@/types';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWoofiProgram } from '@/utils/program';
import toast from 'react-hot-toast';

interface DogCardProps {
  dog: DogWithAddress;
  treasuryAddress: PublicKey;
  onDonationSuccess?: () => void;
}

const DogCard: FC<DogCardProps> = ({ dog, treasuryAddress, onDonationSuccess }) => {
  const { publicKey, connected } = useWallet();
  const program = useWoofiProgram();
  const [donationAmount, setDonationAmount] = useState<number>(0.1);
  const [donationMessage, setDonationMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showDonationForm, setShowDonationForm] = useState<boolean>(false);

  const formatSOL = (lamports: bigint) => {
    return (Number(lamports) / LAMPORTS_PER_SOL).toFixed(2);
  };

  const handleDonate = async () => {
    if (!connected || !publicKey || !program) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (donationAmount <= 0) {
      toast.error('Please enter a valid donation amount');
      return;
    }

    try {
      setIsLoading(true);
      const lamports = donationAmount * LAMPORTS_PER_SOL;
      const timestamp = Date.now();

      await program.methods
        .donate(
          new anchor.BN(lamports),
          donationMessage,
          new anchor.BN(timestamp)
        )
        .accounts({
          donor: publicKey,
          platform: platformPDA[0],
          dog: dog.address,
          donation: donationPDA[0],
          treasury: treasuryAddress,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      toast.success(`Thank you for donating ${donationAmount} SOL to ${dog.name}!`);
      setDonationAmount(0.1);
      setDonationMessage('');
      setShowDonationForm(false);
      if (onDonationSuccess) onDonationSuccess();
    } catch (error) {
      console.error('Error donating:', error);
      toast.error('Failed to process donation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder for anchor and PDA variables
  const anchor = { BN: (n: number) => n, web3: { SystemProgram: { programId: new PublicKey('11111111111111111111111111111111') } } };
  const platformPDA = [new PublicKey('11111111111111111111111111111111')];
  const donationPDA = [new PublicKey('11111111111111111111111111111111')];

  return (
    <div className="card h-full flex flex-col">
      <div className="relative h-48 w-full">
        <Image
          src={dog.imageUrl || 'https://placedog.net/500/280'}
          alt={dog.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4 flex-grow">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{dog.name}</h3>
          <span className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
            {dog.age} {dog.age === 1 ? 'year' : 'years'}
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
          {dog.story}
        </p>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Needs:</h4>
          <div className="flex flex-wrap gap-2">
            {dog.needsFood && (
              <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full">
                Food
              </span>
            )}
            {dog.needsToys && (
              <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full">
                Toys
              </span>
            )}
            {dog.needsMedical && (
              <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded-full">
                Medical
              </span>
            )}
            {dog.needsShelter && (
              <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-1 rounded-full">
                Shelter
              </span>
            )}
            {dog.needsOther && (
              <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-2 py-1 rounded-full">
                {dog.needsOther}
              </span>
            )}
          </div>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          <span className="font-medium">Total donations:</span> {formatSOL(dog.totalDonations)} SOL
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {!showDonationForm ? (
          <button
            onClick={() => setShowDonationForm(true)}
            className="btn btn-primary w-full"
            disabled={!connected}
          >
            {connected ? 'Donate SOL' : 'Connect Wallet to Donate'}
          </button>
        ) : (
          <div className="space-y-3">
            <div>
              <label htmlFor={`amount-${dog.name}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount (SOL)
              </label>
              <input
                id={`amount-${dog.name}`}
                type="number"
                min="0.01"
                step="0.01"
                value={donationAmount}
                onChange={(e) => setDonationAmount(parseFloat(e.target.value))}
                className="input w-full"
              />
            </div>
            <div>
              <label htmlFor={`message-${dog.name}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Message (optional)
              </label>
              <input
                id={`message-${dog.name}`}
                type="text"
                value={donationMessage}
                onChange={(e) => setDonationMessage(e.target.value)}
                className="input w-full"
                placeholder="Add a message..."
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleDonate}
                className="btn btn-primary flex-1"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Confirm Donation'}
              </button>
              <button
                onClick={() => setShowDonationForm(false)}
                className="btn btn-outline"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DogCard;