use crate::*;
use anchor_lang::prelude::*;
use std::str::FromStr;

	#[derive(Accounts)]
	#[instruction(
		treasury: Pubkey,
	)]
	pub struct InitializePlatform<'info> {
		pub admin: Signer<'info>,

		#[account(
			init,
			space=88,
			payer=admin,
			seeds = [
				b"platform",
			],
			bump,
		)]
		pub platform: Account<'info, Platform>,

		pub system_program: Program<'info, System>,
	}

/// Initialize the Woofi platform with an admin wallet
///
/// Accounts:
/// 0. `[signer]` admin: [AccountInfo] 
/// 1. `[writable]` platform: [Platform] The platform configuration account
/// 2. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
///
/// Data:
/// - treasury: [Pubkey] Treasury wallet where funds can be withdrawn to
pub fn handler(
	ctx: Context<InitializePlatform>,
	treasury: Pubkey,
) -> Result<()> {
    // Initialize the platform account
    let platform = &mut ctx.accounts.platform;
    platform.admin = ctx.accounts.admin.key();
    platform.treasury = treasury;
    platform.total_donations = 0;
    platform.dog_count = 0;
    platform.donation_count = 0;

    msg!("Platform initialized with admin: {}", platform.admin);
    msg!("Treasury set to: {}", platform.treasury);
	
	Ok(())
}