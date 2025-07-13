pub mod common;

use std::str::FromStr;
use {
    common::{
		get_program_test,
		woofi_ix_interface,
	},
    solana_program_test::tokio,
    solana_sdk::{
        account::Account, pubkey::Pubkey, rent::Rent, signature::Keypair, signer::Signer, system_program,
    },
};


#[tokio::test]
async fn update_dog_ix_success() {
	let mut program_test = get_program_test();

	// PROGRAMS
	program_test.prefer_bpf(true);

	program_test.add_program(
		"account_compression",
		Pubkey::from_str("cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK").unwrap(),
		None,
	);

	program_test.add_program(
		"noop",
		Pubkey::from_str("noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV").unwrap(),
		None,
	);

	// DATA
	let image_url: String = Default::default();
	let story: String = Default::default();
	let needs_food: bool = Default::default();
	let needs_toys: bool = Default::default();
	let needs_medical: bool = Default::default();
	let needs_shelter: bool = Default::default();
	let needs_other: String = Default::default();
	let active: bool = Default::default();

	// KEYPAIR
	let admin_keypair = Keypair::new();
	let dog_keypair = Keypair::new();

	// PUBKEY
	let admin_pubkey = admin_keypair.pubkey();
	let dog_pubkey = dog_keypair.pubkey();

	// ACCOUNT PROGRAM TEST SETUP
	program_test.add_account(
		admin_pubkey,
		Account {
			lamports: 1_000_000_000_000,
			data: vec![],
			owner: system_program::ID,
			executable: false,
			rent_epoch: 0,
		},
	);

	// INSTRUCTIONS
	let (mut banks_client, _, recent_blockhash) = program_test.start().await;

	let ix = woofi_ix_interface::update_dog_ix_setup(
		&admin_keypair,
		dog_pubkey,
		&image_url,
		&story,
		needs_food,
		needs_toys,
		needs_medical,
		needs_shelter,
		&needs_other,
		active,
		recent_blockhash,
	);

	let result = banks_client.process_transaction(ix).await;

	// ASSERTIONS
	assert!(result.is_ok());

}
