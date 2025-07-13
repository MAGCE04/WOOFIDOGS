use crate::*;
use anchor_lang::prelude::*;
use std::str::FromStr;

#[derive(Accounts)]
#[instruction(
    treasury: Pubkey,
)]
pub struct InitializePlatform<'info> {
    /// The admin account that will have privileged access to platform functions
    /// This account pays for the creation of the platform PDA
    #[account(mut)]
    pub admin: Signer<'info>,

    /// The platform account that stores configuration and statistics
    /// This is a PDA with seeds ["platform"]
    #[account(
        init,
        space = 8 + std::mem::size_of::<Platform>(),
        payer = admin,
        seeds = [
            b"platform",
        ],
        bump,
    )]
    pub platform: Account<'info, Platform>,

    /// The system program is required for account creation
    pub system_program: Program<'info, System>,
}

/// Initialize the WooFi platform with an admin wallet
///
/// This instruction can only be called once to set up the platform.
/// It creates a PDA to store platform configuration and statistics.
///
/// # Arguments
/// * `ctx` - The context of accounts
/// * `treasury` - The treasury wallet address where platform fees and withdrawals will be sent
///
/// # Accounts
/// * `admin` - The wallet that will have admin privileges (signer, writable)
/// * `platform` - The platform configuration account (PDA, writable)
/// * `system_program` - Required for account initialization
///
/// # Errors
/// * `Unauthorized` - If the treasury address is invalid (system program, program ID, or zero address)
pub fn handler(
    ctx: Context<InitializePlatform>,
    treasury: Pubkey,
) -> Result<()> {
    // Validate treasury is not a system address, program, or zero address
    require!(
        treasury != System::id() && 
        treasury != ctx.program_id &&
        treasury != Pubkey::default(),
        WoofiError::Unauthorized
    );

    // Initialize the platform account with default values
    let platform = &mut ctx.accounts.platform;
    
    // Set admin to the signer of this transaction
    platform.admin = ctx.accounts.admin.key();
    
    // Set treasury to the provided address
    platform.treasury = treasury;
    
    // Initialize statistics counters
    platform.total_donations = 0;
    platform.dog_count = 0;
    platform.donation_count = 0;

    // Log initialization details
    msg!("🐶 WooFi Platform initialized successfully");
    msg!("Admin: {}", platform.admin);
    msg!("Treasury: {}", platform.treasury);
    
    Ok(())
}