
use anchor_lang::prelude::*;

#[account]
pub struct Platform {
	pub admin: Pubkey,
	pub treasury: Pubkey,
	pub total_donations: u64,
	pub dog_count: u32,
	pub donation_count: u32,
}
