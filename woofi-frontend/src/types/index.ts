import { PublicKey } from '@solana/web3.js';

export interface Dog {
  name: string;
  age: number;
  imageUrl: string;
  story: string;
  needsFood: boolean;
  needsToys: boolean;
  needsMedical: boolean;
  needsShelter: boolean;
  needsOther: string;
  totalDonations: bigint;
  admin: PublicKey;
  active: boolean;
}

export interface Donation {
  donor: PublicKey;
  dogId: PublicKey;
  amount: bigint;
  timestamp: bigint;
  message: string;
}

export interface Platform {
  admin: PublicKey;
  treasury: PublicKey;
  totalDonations: bigint;
  dogCount: number;
  donationCount: number;
}

export interface DogWithAddress extends Dog {
  address: PublicKey;
}