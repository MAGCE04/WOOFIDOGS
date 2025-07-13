import {PublicKey} from "@solana/web3.js";
import {BN} from "@coral-xyz/anchor";

export const derivePlatformAccountPDA = (programId: PublicKey): [PublicKey, number] => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("platform"),
        ],
        programId,
    )
};

export type DogAccountSeeds = {
    name: string, 
};

export const deriveDogAccountPDA = (
    seeds: DogAccountSeeds,
    programId: PublicKey
): [PublicKey, number] => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("dog"),
            Buffer.from(seeds.name, "utf8"),
        ],
        programId,
    )
};

export type DonationAccountSeeds = {
    donor: PublicKey, 
    timestamp: bigint, 
};

export const deriveDonationAccountPDA = (
    seeds: DonationAccountSeeds,
    programId: PublicKey
): [PublicKey, number] => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("donation"),
            seeds.donor.toBuffer(),
            Buffer.from(BigInt64Array.from([seeds.timestamp]).buffer),
        ],
        programId,
    )
};

