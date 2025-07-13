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
async fn add_dog_ix_success() {
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
	let name: String = Default::default();
	let age: u8 = Default::default();
	let image_url: String = Default::default();
	let story: String = Default::default();
	let needs_food: bool = Default::default();
	let needs_toys: bool = Default::default();
	let needs_medical: bool = Default::default();
	let needs_shelter: bool = Default::default();
	let needs_other: String = Default::default();

	// KEYPAIR
	let admin_keypair = Keypair::new();

	// PUBKEY
	let admin_pubkey = admin_keypair.pubkey();

	// EXECUTABLE PUBKEY
	let system_program_pubkey = Pubkey::from_str("11111111111111111111111111111111").unwrap();

	// PDA
	let (platform_pda, _platform_pda_bump) = Pubkey::find_program_address(
		&[
			b"platform",
		],
		&woofi::ID,
	);

	let (dog_pda, _dog_pda_bump) = Pubkey::find_program_address(
		&[
			b"dog",
			name.as_bytes().as_ref(),
		],
		&woofi::ID,
	);

	// ACCOUNT PROGRAM TEST SETUP
	program_test.add_account(
		admin_pubkey,
		Account {
			lamports: 0,
			data: vec![],
			owner: system_program::ID,
			executable: false,
			rent_epoch: 0,
		},
	);

	// INSTRUCTIONS
	let (mut banks_client, _, recent_blockhash) = program_test.start().await;

	let ix = woofi_ix_interface::add_dog_ix_setup(
		&admin_keypair,
		platform_pda,
		dog_pda,
		system_program_pubkey,
		&name,
		age,
		&image_url,
		&story,
		needs_food,
		needs_toys,
		needs_medical,
		needs_shelter,
		&needs_other,
		recent_blockhash,
	);

	let result = banks_client.process_transaction(ix).await;

	// ASSERTIONS
	assert!(result.is_ok());

}
