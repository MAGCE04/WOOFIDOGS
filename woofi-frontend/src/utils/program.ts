'use client';

import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorProvider, Program, web3, BN } from '@coral-xyz/anchor';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';
import idl from '../idl/woofi.json';

// Program ID from the deployed contract
const PROGRAM_ID = new PublicKey('CpPKTheeec2m2WMMsSg6ykyhRUu8FVcpUpoo1QvrNHmN');

export function useWoofiProgram() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const program = useMemo(() => {
    if (!wallet) return null;

    const provider = new AnchorProvider(
      connection,
      wallet,
      AnchorProvider.defaultOptions()
    );

    return new Program(idl as any, PROGRAM_ID, provider);
  }, [connection, wallet]);

  return program;
}

// PDA helpers
export const findPlatformPDA = () => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('platform')],
    PROGRAM_ID
  );
};

export const findDogPDA = (name: string) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('dog'), Buffer.from(name)],
    PROGRAM_ID
  );
};

export const findDonationPDA = (donor: PublicKey, timestamp: number) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('donation'),
      donor.toBuffer(),
      new BN(timestamp).toArrayLike(Buffer, 'le', 8)
    ],
    PROGRAM_ID
  );
};