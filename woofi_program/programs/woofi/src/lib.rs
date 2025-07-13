
pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;
use std::str::FromStr;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("CpPKTheeec2m2WMMsSg6ykyhRUu8FVcpUpoo1QvrNHmN");

#[program]
pub mod woofi {
    use super::*;

/// Initialize the Woofi platform with an admin wallet
///
/// Accounts:
/// 0. `[signer]` admin: [AccountInfo] 
/// 1. `[writable]` platform: [Platform] The platform configuration account
/// 2. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
///
/// Data:
/// - treasury: [Pubkey] Treasury wallet where funds can be withdrawn to
	pub fn initialize_platform(ctx: Context<InitializePlatform>, treasury: Pubkey) -> Result<()> {
		initialize_platform::handler(ctx, treasury)
	}

/// Add a new dog to the platform
///
/// Accounts:
/// 0. `[signer]` admin: [AccountInfo] 
/// 1. `[writable]` platform: [Platform] The platform configuration account
/// 2. `[writable]` dog: [Dog] The dog account to be created
/// 3. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
///
/// Data:
/// - name: [String] Name of the dog
/// - age: [u8] Age of the dog in years
/// - image_url: [String] URL to the dog's image
/// - story: [String] The rescue story of the dog
/// - needs_food: [bool] Whether the dog needs food
/// - needs_toys: [bool] Whether the dog needs toys
/// - needs_medical: [bool] Whether the dog needs medical support
/// - needs_shelter: [bool] Whether the dog needs shelter
/// - needs_other: [String] Other specific needs
	pub fn add_dog(ctx: Context<AddDog>, name: String, age: u8, image_url: String, story: String, needs_food: bool, needs_toys: bool, needs_medical: bool, needs_shelter: bool, needs_other: String) -> Result<()> {
		add_dog::handler(ctx, name, age, image_url, story, needs_food, needs_toys, needs_medical, needs_shelter, needs_other)
	}

/// Update a dog's information
///
/// Accounts:
/// 0. `[signer]` admin: [AccountInfo] 
/// 1. `[writable]` dog: [Dog] The dog account to be updated
///
/// Data:
/// - image_url: [String] Updated URL to the dog's image
/// - story: [String] Updated rescue story of the dog
/// - needs_food: [bool] Whether the dog needs food
/// - needs_toys: [bool] Whether the dog needs toys
/// - needs_medical: [bool] Whether the dog needs medical support
/// - needs_shelter: [bool] Whether the dog needs shelter
/// - needs_other: [String] Other specific needs
/// - active: [bool] Whether the dog is currently active on the platform
	pub fn update_dog(ctx: Context<UpdateDog>, image_url: String, story: String, needs_food: bool, needs_toys: bool, needs_medical: bool, needs_shelter: bool, needs_other: String, active: bool) -> Result<()> {
		update_dog::handler(ctx, image_url, story, needs_food, needs_toys, needs_medical, needs_shelter, needs_other, active)
	}

/// Make a donation to a specific dog
///
/// Accounts:
/// 0. `[writable, signer]` donor: [AccountInfo] 
/// 1. `[writable]` platform: [Platform] The platform configuration account
/// 2. `[writable]` dog: [Dog] The dog receiving the donation
/// 3. `[writable]` donation: [Donation] The donation record account
/// 4. `[writable]` treasury: [AccountInfo] Treasury wallet to receive the donation
/// 5. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
///
/// Data:
/// - amount: [u64] Amount of SOL to donate
/// - message: [String] Optional message from the donor
/// - timestamp: [i64] Unix timestamp of when the donation was made
	pub fn donate(ctx: Context<Donate>, amount: u64, message: String, timestamp: i64) -> Result<()> {
		donate::handler(ctx, amount, message, timestamp)
	}

/// Allow admin to withdraw funds from the treasury
///
/// Accounts:
/// 0. `[signer]` admin: [AccountInfo] 
/// 1. `[]` platform: [Platform] The platform configuration account
/// 2. `[writable]` treasury: [AccountInfo] Treasury wallet to withdraw from
/// 3. `[writable]` recipient: [AccountInfo] Recipient wallet to receive the funds
///
/// Data:
/// - amount: [u64] Amount of SOL to withdraw
	pub fn withdraw_funds(ctx: Context<WithdrawFunds>, amount: u64) -> Result<()> {
		withdraw_funds::handler(ctx, amount)
	}



}
