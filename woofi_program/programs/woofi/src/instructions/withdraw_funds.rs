use crate::*;
use anchor_lang::prelude::*;
use std::str::FromStr;

	#[derive(Accounts)]
	#[instruction(
		amount: u64,
	)]
	pub struct WithdrawFunds<'info> {
		#[account(
            constraint = admin.key() == platform.admin @ error::WoofiError::Unauthorized
        )]
		pub admin: Signer<'info>,

		#[account(
			seeds = [
				b"platform",
			],
			bump,
		)]
		pub platform: Account<'info, Platform>,

		#[account(
			mut,
            address = platform.treasury @ error::WoofiError::Unauthorized
		)]
		/// CHECK: Treasury address is verified against platform.treasury
		pub treasury: UncheckedAccount<'info>,

		#[account(
			mut,
		)]
		/// CHECK: Recipient is specified by the admin
		pub recipient: UncheckedAccount<'info>,
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
pub fn handler(
	ctx: Context<WithdrawFunds>,
	amount: u64,
) -> Result<()> {
    // Validate the withdrawal amount
    if amount == 0 {
        return err!(error::WoofiError::InvalidAmount);
    }

    // Check if treasury has enough funds
    let treasury_balance = ctx.accounts.treasury.lamports();
    if treasury_balance < amount {
        return err!(error::WoofiError::InsufficientFunds);
    }

    // Transfer SOL from treasury to recipient
    **ctx.accounts.treasury.try_borrow_mut_lamports()? -= amount;
    **ctx.accounts.recipient.try_borrow_mut_lamports()? += amount;

    msg!("Withdrawn {} lamports from treasury to recipient", amount);
	
	Ok(())
}