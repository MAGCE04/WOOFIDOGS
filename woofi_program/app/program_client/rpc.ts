import {
  AnchorProvider,
  BN,
  IdlAccounts,
  Program,
  web3,
} from "@coral-xyz/anchor";
import { MethodsBuilder } from "@coral-xyz/anchor/dist/cjs/program/namespace/methods";
import { Woofi } from "../../target/types/woofi";
import idl from "../../target/idl/woofi.json";
import * as pda from "./pda";



let _program: Program<Woofi>;


export const initializeClient = (
    programId: web3.PublicKey,
    anchorProvider = AnchorProvider.env(),
) => {
    _program = new Program<Woofi>(
        idl as never,
        programId,
        anchorProvider,
    );


};

export type InitializePlatformArgs = {
  admin: web3.PublicKey;
  treasury: web3.PublicKey;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Initialize the Woofi platform with an admin wallet
 *
 * Accounts:
 * 0. `[signer]` admin: {@link PublicKey} 
 * 1. `[writable]` platform: {@link Platform} The platform configuration account
 * 2. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - treasury: {@link PublicKey} Treasury wallet where funds can be withdrawn to
 */
export const initializePlatformBuilder = (
	args: InitializePlatformArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<Woofi, never> => {
  const [platformPubkey] = pda.derivePlatformAccountPDA(_program.programId);

  return _program
    .methods
    .initializePlatform(
      args.treasury,
    )
    .accountsStrict({
      admin: args.admin,
      platform: platformPubkey,
      systemProgram: new web3.PublicKey("11111111111111111111111111111111"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Initialize the Woofi platform with an admin wallet
 *
 * Accounts:
 * 0. `[signer]` admin: {@link PublicKey} 
 * 1. `[writable]` platform: {@link Platform} The platform configuration account
 * 2. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - treasury: {@link PublicKey} Treasury wallet where funds can be withdrawn to
 */
export const initializePlatform = (
	args: InitializePlatformArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    initializePlatformBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Initialize the Woofi platform with an admin wallet
 *
 * Accounts:
 * 0. `[signer]` admin: {@link PublicKey} 
 * 1. `[writable]` platform: {@link Platform} The platform configuration account
 * 2. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - treasury: {@link PublicKey} Treasury wallet where funds can be withdrawn to
 */
export const initializePlatformSendAndConfirm = async (
  args: Omit<InitializePlatformArgs, "admin"> & {
    signers: {
      admin: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return initializePlatformBuilder({
      ...args,
      admin: args.signers.admin.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.admin])
    .rpc();
}

export type AddDogArgs = {
  admin: web3.PublicKey;
  name: string;
  age: number;
  imageUrl: string;
  story: string;
  needsFood: boolean;
  needsToys: boolean;
  needsMedical: boolean;
  needsShelter: boolean;
  needsOther: string;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Add a new dog to the platform
 *
 * Accounts:
 * 0. `[signer]` admin: {@link PublicKey} 
 * 1. `[writable]` platform: {@link Platform} The platform configuration account
 * 2. `[writable]` dog: {@link Dog} The dog account to be created
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - name: {@link string} Name of the dog
 * - age: {@link number} Age of the dog in years
 * - image_url: {@link string} URL to the dog's image
 * - story: {@link string} The rescue story of the dog
 * - needs_food: {@link boolean} Whether the dog needs food
 * - needs_toys: {@link boolean} Whether the dog needs toys
 * - needs_medical: {@link boolean} Whether the dog needs medical support
 * - needs_shelter: {@link boolean} Whether the dog needs shelter
 * - needs_other: {@link string} Other specific needs
 */
export const addDogBuilder = (
	args: AddDogArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<Woofi, never> => {
  const [platformPubkey] = pda.derivePlatformAccountPDA(_program.programId);
    const [dogPubkey] = pda.deriveDogAccountPDA({
        name: args.name,
    }, _program.programId);

  return _program
    .methods
    .addDog(
      args.name,
      args.age,
      args.imageUrl,
      args.story,
      args.needsFood,
      args.needsToys,
      args.needsMedical,
      args.needsShelter,
      args.needsOther,
    )
    .accountsStrict({
      admin: args.admin,
      platform: platformPubkey,
      dog: dogPubkey,
      systemProgram: new web3.PublicKey("11111111111111111111111111111111"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Add a new dog to the platform
 *
 * Accounts:
 * 0. `[signer]` admin: {@link PublicKey} 
 * 1. `[writable]` platform: {@link Platform} The platform configuration account
 * 2. `[writable]` dog: {@link Dog} The dog account to be created
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - name: {@link string} Name of the dog
 * - age: {@link number} Age of the dog in years
 * - image_url: {@link string} URL to the dog's image
 * - story: {@link string} The rescue story of the dog
 * - needs_food: {@link boolean} Whether the dog needs food
 * - needs_toys: {@link boolean} Whether the dog needs toys
 * - needs_medical: {@link boolean} Whether the dog needs medical support
 * - needs_shelter: {@link boolean} Whether the dog needs shelter
 * - needs_other: {@link string} Other specific needs
 */
export const addDog = (
	args: AddDogArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    addDogBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Add a new dog to the platform
 *
 * Accounts:
 * 0. `[signer]` admin: {@link PublicKey} 
 * 1. `[writable]` platform: {@link Platform} The platform configuration account
 * 2. `[writable]` dog: {@link Dog} The dog account to be created
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - name: {@link string} Name of the dog
 * - age: {@link number} Age of the dog in years
 * - image_url: {@link string} URL to the dog's image
 * - story: {@link string} The rescue story of the dog
 * - needs_food: {@link boolean} Whether the dog needs food
 * - needs_toys: {@link boolean} Whether the dog needs toys
 * - needs_medical: {@link boolean} Whether the dog needs medical support
 * - needs_shelter: {@link boolean} Whether the dog needs shelter
 * - needs_other: {@link string} Other specific needs
 */
export const addDogSendAndConfirm = async (
  args: Omit<AddDogArgs, "admin"> & {
    signers: {
      admin: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return addDogBuilder({
      ...args,
      admin: args.signers.admin.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.admin])
    .rpc();
}

export type UpdateDogArgs = {
  admin: web3.PublicKey;
  dog: web3.PublicKey;
  imageUrl: string;
  story: string;
  needsFood: boolean;
  needsToys: boolean;
  needsMedical: boolean;
  needsShelter: boolean;
  needsOther: string;
  active: boolean;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Update a dog's information
 *
 * Accounts:
 * 0. `[signer]` admin: {@link PublicKey} 
 * 1. `[writable]` dog: {@link Dog} The dog account to be updated
 *
 * Data:
 * - image_url: {@link string} Updated URL to the dog's image
 * - story: {@link string} Updated rescue story of the dog
 * - needs_food: {@link boolean} Whether the dog needs food
 * - needs_toys: {@link boolean} Whether the dog needs toys
 * - needs_medical: {@link boolean} Whether the dog needs medical support
 * - needs_shelter: {@link boolean} Whether the dog needs shelter
 * - needs_other: {@link string} Other specific needs
 * - active: {@link boolean} Whether the dog is currently active on the platform
 */
export const updateDogBuilder = (
	args: UpdateDogArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<Woofi, never> => {


  return _program
    .methods
    .updateDog(
      args.imageUrl,
      args.story,
      args.needsFood,
      args.needsToys,
      args.needsMedical,
      args.needsShelter,
      args.needsOther,
      args.active,
    )
    .accountsStrict({
      admin: args.admin,
      dog: args.dog,
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Update a dog's information
 *
 * Accounts:
 * 0. `[signer]` admin: {@link PublicKey} 
 * 1. `[writable]` dog: {@link Dog} The dog account to be updated
 *
 * Data:
 * - image_url: {@link string} Updated URL to the dog's image
 * - story: {@link string} Updated rescue story of the dog
 * - needs_food: {@link boolean} Whether the dog needs food
 * - needs_toys: {@link boolean} Whether the dog needs toys
 * - needs_medical: {@link boolean} Whether the dog needs medical support
 * - needs_shelter: {@link boolean} Whether the dog needs shelter
 * - needs_other: {@link string} Other specific needs
 * - active: {@link boolean} Whether the dog is currently active on the platform
 */
export const updateDog = (
	args: UpdateDogArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    updateDogBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Update a dog's information
 *
 * Accounts:
 * 0. `[signer]` admin: {@link PublicKey} 
 * 1. `[writable]` dog: {@link Dog} The dog account to be updated
 *
 * Data:
 * - image_url: {@link string} Updated URL to the dog's image
 * - story: {@link string} Updated rescue story of the dog
 * - needs_food: {@link boolean} Whether the dog needs food
 * - needs_toys: {@link boolean} Whether the dog needs toys
 * - needs_medical: {@link boolean} Whether the dog needs medical support
 * - needs_shelter: {@link boolean} Whether the dog needs shelter
 * - needs_other: {@link string} Other specific needs
 * - active: {@link boolean} Whether the dog is currently active on the platform
 */
export const updateDogSendAndConfirm = async (
  args: Omit<UpdateDogArgs, "admin"> & {
    signers: {
      admin: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return updateDogBuilder({
      ...args,
      admin: args.signers.admin.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.admin])
    .rpc();
}

export type DonateArgs = {
  donor: web3.PublicKey;
  dog: web3.PublicKey;
  treasury: web3.PublicKey;
  amount: bigint;
  message: string;
  timestamp: bigint;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Make a donation to a specific dog
 *
 * Accounts:
 * 0. `[writable, signer]` donor: {@link PublicKey} 
 * 1. `[writable]` platform: {@link Platform} The platform configuration account
 * 2. `[writable]` dog: {@link Dog} The dog receiving the donation
 * 3. `[writable]` donation: {@link Donation} The donation record account
 * 4. `[writable]` treasury: {@link PublicKey} Treasury wallet to receive the donation
 * 5. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - amount: {@link BigInt} Amount of SOL to donate
 * - message: {@link string} Optional message from the donor
 * - timestamp: {@link BigInt} Unix timestamp of when the donation was made
 */
export const donateBuilder = (
	args: DonateArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<Woofi, never> => {
  const [platformPubkey] = pda.derivePlatformAccountPDA(_program.programId);
    const [donationPubkey] = pda.deriveDonationAccountPDA({
        donor: args.donor,
        timestamp: args.timestamp,
    }, _program.programId);

  return _program
    .methods
    .donate(
      new BN(args.amount.toString()),
      args.message,
      new BN(args.timestamp.toString()),
    )
    .accountsStrict({
      donor: args.donor,
      platform: platformPubkey,
      dog: args.dog,
      donation: donationPubkey,
      treasury: args.treasury,
      systemProgram: new web3.PublicKey("11111111111111111111111111111111"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Make a donation to a specific dog
 *
 * Accounts:
 * 0. `[writable, signer]` donor: {@link PublicKey} 
 * 1. `[writable]` platform: {@link Platform} The platform configuration account
 * 2. `[writable]` dog: {@link Dog} The dog receiving the donation
 * 3. `[writable]` donation: {@link Donation} The donation record account
 * 4. `[writable]` treasury: {@link PublicKey} Treasury wallet to receive the donation
 * 5. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - amount: {@link BigInt} Amount of SOL to donate
 * - message: {@link string} Optional message from the donor
 * - timestamp: {@link BigInt} Unix timestamp of when the donation was made
 */
export const donate = (
	args: DonateArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    donateBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Make a donation to a specific dog
 *
 * Accounts:
 * 0. `[writable, signer]` donor: {@link PublicKey} 
 * 1. `[writable]` platform: {@link Platform} The platform configuration account
 * 2. `[writable]` dog: {@link Dog} The dog receiving the donation
 * 3. `[writable]` donation: {@link Donation} The donation record account
 * 4. `[writable]` treasury: {@link PublicKey} Treasury wallet to receive the donation
 * 5. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - amount: {@link BigInt} Amount of SOL to donate
 * - message: {@link string} Optional message from the donor
 * - timestamp: {@link BigInt} Unix timestamp of when the donation was made
 */
export const donateSendAndConfirm = async (
  args: Omit<DonateArgs, "donor"> & {
    signers: {
      donor: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return donateBuilder({
      ...args,
      donor: args.signers.donor.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.donor])
    .rpc();
}

export type WithdrawFundsArgs = {
  admin: web3.PublicKey;
  treasury: web3.PublicKey;
  recipient: web3.PublicKey;
  amount: bigint;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Allow admin to withdraw funds from the treasury
 *
 * Accounts:
 * 0. `[signer]` admin: {@link PublicKey} 
 * 1. `[]` platform: {@link Platform} The platform configuration account
 * 2. `[writable]` treasury: {@link PublicKey} Treasury wallet to withdraw from
 * 3. `[writable]` recipient: {@link PublicKey} Recipient wallet to receive the funds
 *
 * Data:
 * - amount: {@link BigInt} Amount of SOL to withdraw
 */
export const withdrawFundsBuilder = (
	args: WithdrawFundsArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<Woofi, never> => {
  const [platformPubkey] = pda.derivePlatformAccountPDA(_program.programId);

  return _program
    .methods
    .withdrawFunds(
      new BN(args.amount.toString()),
    )
    .accountsStrict({
      admin: args.admin,
      platform: platformPubkey,
      treasury: args.treasury,
      recipient: args.recipient,
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Allow admin to withdraw funds from the treasury
 *
 * Accounts:
 * 0. `[signer]` admin: {@link PublicKey} 
 * 1. `[]` platform: {@link Platform} The platform configuration account
 * 2. `[writable]` treasury: {@link PublicKey} Treasury wallet to withdraw from
 * 3. `[writable]` recipient: {@link PublicKey} Recipient wallet to receive the funds
 *
 * Data:
 * - amount: {@link BigInt} Amount of SOL to withdraw
 */
export const withdrawFunds = (
	args: WithdrawFundsArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    withdrawFundsBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Allow admin to withdraw funds from the treasury
 *
 * Accounts:
 * 0. `[signer]` admin: {@link PublicKey} 
 * 1. `[]` platform: {@link Platform} The platform configuration account
 * 2. `[writable]` treasury: {@link PublicKey} Treasury wallet to withdraw from
 * 3. `[writable]` recipient: {@link PublicKey} Recipient wallet to receive the funds
 *
 * Data:
 * - amount: {@link BigInt} Amount of SOL to withdraw
 */
export const withdrawFundsSendAndConfirm = async (
  args: Omit<WithdrawFundsArgs, "admin"> & {
    signers: {
      admin: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return withdrawFundsBuilder({
      ...args,
      admin: args.signers.admin.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.admin])
    .rpc();
}

// Getters

export const getDog = (
    publicKey: web3.PublicKey,
    commitment?: web3.Commitment
): Promise<IdlAccounts<Woofi>["dog"]> => _program.account.dog.fetch(publicKey, commitment);

export const getDonation = (
    publicKey: web3.PublicKey,
    commitment?: web3.Commitment
): Promise<IdlAccounts<Woofi>["donation"]> => _program.account.donation.fetch(publicKey, commitment);

export const getPlatform = (
    publicKey: web3.PublicKey,
    commitment?: web3.Commitment
): Promise<IdlAccounts<Woofi>["platform"]> => _program.account.platform.fetch(publicKey, commitment);
