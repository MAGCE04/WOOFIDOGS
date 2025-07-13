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
async fn withdraw_funds_ix_success() {
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

	// KEYPAIR
	let admin_keypair = Keypair::new();

	// PUBKEY
	let admin_pubkey = admin_keypair.pubkey();
	let treasury_pubkey = Pubkey::new_unique();
	let recipient_pubkey = Pubkey::new_unique();

	// PDA
	let (platform_pda, _platform_pda_bump) = Pubkey::find_program_address(
		&[
			b"platform",
		],
		&woofi::ID,
	);

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

	let ix = woofi_ix_interface::withdraw_funds_ix_setup(
		&admin_keypair,
		platform_pda,
		treasury_pubkey,
		recipient_pubkey,
		amount,
		recent_blockhash,
	);

	let result = banks_client.process_transaction(ix).await;

	// ASSERTIONS
	assert!(result.is_ok());

}
