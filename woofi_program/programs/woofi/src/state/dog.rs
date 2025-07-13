
use anchor_lang::prelude::*;

#[account]
pub struct Dog {
	pub name: String,
	pub age: u8,
	pub image_url: String,
	pub story: String,
	pub needs_food: bool,
	pub needs_toys: bool,
	pub needs_medical: bool,
	pub needs_shelter: bool,
	pub needs_other: String,
	pub total_donations: u64,
	pub admin: Pubkey,
	pub active: bool,
}
