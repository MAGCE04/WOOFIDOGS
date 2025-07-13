// This file is auto-generated from the CIDL source.
// Editing this file directly is not recommended as it may be overwritten.
//
// Docs: https://docs.codigo.ai/c%C3%B3digo-interface-description-language/specification#errors

use anchor_lang::prelude::*;

#[error_code]
pub enum WoofiError {
	#[msg("Only the admin can perform this action")]
	Unauthorized,
	#[msg("Donation amount must be positive")]
	InvalidAmount,
	#[msg("The referenced dog does not exist")]
	DogNotFound,
	#[msg("Insufficient funds for withdrawal")]
	InsufficientFunds,
	#[msg("Dog name cannot be empty")]
	InvalidDogName,
	#[msg("Dog story cannot be empty")]
	InvalidDogStory,
	#[msg("Image URL cannot be empty")]
	InvalidImageUrl,
}
