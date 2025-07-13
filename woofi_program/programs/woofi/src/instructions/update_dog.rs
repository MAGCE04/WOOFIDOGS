use crate::*;
use anchor_lang::prelude::*;
use std::str::FromStr;

	#[derive(Accounts)]
	#[instruction(
		image_url: String,
		story: String,
		needs_food: bool,
		needs_toys: bool,
		needs_medical: bool,
		needs_shelter: bool,
		needs_other: String,
		active: bool,
	)]
	pub struct UpdateDog<'info> {
		#[account(
            constraint = admin.key() == dog.admin @ error::WoofiError::Unauthorized
        )]
		pub admin: Signer<'info>,

		#[account(
			mut,
		)]
		pub dog: Account<'info, Dog>,
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
pub fn handler(
	ctx: Context<UpdateDog>,
	image_url: String,
	story: String,
	needs_food: bool,
	needs_toys: bool,
	needs_medical: bool,
	needs_shelter: bool,
	needs_other: String,
	active: bool,
) -> Result<()> {
    // Validate inputs
    if story.trim().is_empty() {
        return err!(error::WoofiError::InvalidDogStory);
    }

    if image_url.trim().is_empty() {
        return err!(error::WoofiError::InvalidImageUrl);
    }

    // Update the dog account
    let dog = &mut ctx.accounts.dog;
    dog.image_url = image_url;
    dog.story = story;
    dog.needs_food = needs_food;
    dog.needs_toys = needs_toys;
    dog.needs_medical = needs_medical;
    dog.needs_shelter = needs_shelter;
    dog.needs_other = needs_other;
    dog.active = active;

    msg!("Updated dog: {}", dog.name);
	
	Ok(())
}