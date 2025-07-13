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
async fn donate_ix_success() {
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
	let amount: u64 = Default::default();
	let message: String = Default::default();
	let timestamp: i64 = Default::default();

	// KEYPAIR
	let donor_keypair = Keypair::new();
	let dog_keypair = Keypair::new();

	// PUBKEY
	let donor_pubkey = donor_keypair.pubkey();
	let dog_pubkey = dog_keypair.pubkey();
	let treasury_pubkey = Pubkey::new_unique();

	// EXECUTABLE PUBKEY
	let system_program_pubkey = Pubkey::from_str("11111111111111111111111111111111").unwrap();

	// PDA
	let (platform_pda, _platform_pda_bump) = Pubkey::find_program_address(
		&[
			b"platform",
		],
		&woofi::ID,
	);

	let (donation_pda, _donation_pda_bump) = Pubkey::find_program_address(
		&[
			b"donation",
			donor_pubkey.as_ref(),
			timestamp.to_le_bytes().as_ref(),
		],
		&woofi::ID,
	);

	// ACCOUNT PROGRAM TEST SETUP
	program_test.add_account(
		donor_pubkey,
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

	let ix = woofi_ix_interface::donate_ix_setup(
		&donor_keypair,
		platform_pda,
		dog_pubkey,
		donation_pda,
		treasury_pubkey,
		system_program_pubkey,
		amount,
		&message,
		timestamp,
		recent_blockhash,
	);

	let result = banks_client.process_transaction(ix).await;

	// ASSERTIONS
	assert!(result.is_ok());

}
