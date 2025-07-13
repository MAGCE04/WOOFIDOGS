
use anchor_lang::prelude::*;

#[account]
pub struct Donation {
	pub donor: Pubkey,
	pub dog_id: Pubkey,
	pub amount: u64,
	pub timestamp: i64,
	pub message: String,
}
