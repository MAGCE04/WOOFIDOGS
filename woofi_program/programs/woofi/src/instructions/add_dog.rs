use crate::*;
use anchor_lang::prelude::*;
use std::str::FromStr;

	#[derive(Accounts)]
	#[instruction(
		name: String,
		age: u8,
		image_url: String,
		story: String,
		needs_food: bool,
		needs_toys: bool,
		needs_medical: bool,
		needs_shelter: bool,
		needs_other: String,
	)]
	pub struct AddDog<'info> {
		#[account(
            constraint = admin.key() == platform.admin @ error::WoofiError::Unauthorized
        )]
		pub admin: Signer<'info>,

		#[account(
			mut,
			seeds = [
				b"platform",
			],
			bump,
		)]
		pub platform: Account<'info, Platform>,

		#[account(
			init,
			space=1420,
			payer=admin,
			seeds = [
				b"dog",
				name.as_bytes().as_ref(),
			],
			bump,
		)]
		pub dog: Account<'info, Dog>,

		pub system_program: Program<'info, System>,
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
pub fn handler(
	ctx: Context<AddDog>,
	name: String,
	age: u8,
	image_url: String,
	story: String,
	needs_food: bool,
	needs_toys: bool,
	needs_medical: bool,
	needs_shelter: bool,
	needs_other: String,
) -> Result<()> {
    // Validate inputs
    if name.trim().is_empty() {
        return err!(error::WoofiError::InvalidDogName);
    }

    if story.trim().is_empty() {
        return err!(error::WoofiError::InvalidDogStory);
    }

    if image_url.trim().is_empty() {
        return err!(error::WoofiError::InvalidImageUrl);
    }

    // Initialize the dog account
    let dog = &mut ctx.accounts.dog;
    dog.name = name;
    dog.age = age;
    dog.image_url = image_url;
    dog.story = story;
    dog.needs_food = needs_food;
    dog.needs_toys = needs_toys;
    dog.needs_medical = needs_medical;
    dog.needs_shelter = needs_shelter;
    dog.needs_other = needs_other;
    dog.total_donations = 0;
    dog.admin = ctx.accounts.admin.key();
    dog.active = true;

    // Update platform stats
    let platform = &mut ctx.accounts.platform;
    platform.dog_count = platform.dog_count.checked_add(1).unwrap();

    msg!("Added new dog: {}", dog.name);
	
	Ok(())
}