use crate::*;
use anchor_lang::prelude::*;
use std::str::FromStr;

	#[derive(Accounts)]
	#[instruction(
		amount: u64,
		message: String,
		timestamp: i64,
	)]
	pub struct Donate<'info> {
		#[account(
			mut,
		)]
		pub donor: Signer<'info>,

		#[account(
			mut,
			seeds = [
				b"platform",
			],
			bump,
		)]
		pub platform: Account<'info, Platform>,

		#[account(
			mut,
		)]
		pub dog: Account<'info, Dog>,

		#[account(
			init,
			space=292,
			payer=donor,
			seeds = [
				b"donation",
				donor.key().as_ref(),
				timestamp.to_le_bytes().as_ref(),
			],
			bump,
		)]
		pub donation: Account<'info, Donation>,

		#[account(
			mut,
            address = platform.treasury,
		)]
		/// CHECK: Treasury address is verified against platform.treasury
		pub treasury: UncheckedAccount<'info>,

		pub system_program: Program<'info, System>,
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
pub fn handler(
	ctx: Context<Donate>,
	amount: u64,
	message: String,
	timestamp: i64,
) -> Result<()> {
    // Validate the donation amount
    if amount == 0 {
        return err!(error::WoofiError::InvalidAmount);
    }

    // Transfer SOL from donor to treasury
    let transfer_instruction = anchor_lang::system_program::transfer(
        ctx.accounts.donor.to_account_info().key,
        ctx.accounts.treasury.to_account_info().key,
        amount,
    );

    anchor_lang::solana_program::program::invoke(
        &transfer_instruction,
        &[
            ctx.accounts.donor.to_account_info(),
            ctx.accounts.treasury.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
    )?;

    // Update donation record
    let donation = &mut ctx.accounts.donation;
    donation.donor = ctx.accounts.donor.key();
    donation.dog_id = ctx.accounts.dog.key();
    donation.amount = amount;
    donation.timestamp = timestamp;
    donation.message = message;

    // Update dog's total donations
    let dog = &mut ctx.accounts.dog;
    dog.total_donations = dog.total_donations.checked_add(amount).unwrap();

    // Update platform's total donations and donation count
    let platform = &mut ctx.accounts.platform;
    platform.total_donations = platform.total_donations.checked_add(amount).unwrap();
    platform.donation_count = platform.donation_count.checked_add(1).unwrap();

    msg!("Donation of {} lamports made to dog: {}", amount, dog.name);
	
	Ok(())
}