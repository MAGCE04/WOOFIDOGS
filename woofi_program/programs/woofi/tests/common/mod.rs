use {
	woofi::{
			entry,
			ID as PROGRAM_ID,
	},
	solana_sdk::{
		entrypoint::{ProcessInstruction, ProgramResult},
		pubkey::Pubkey,
	},
	anchor_lang::prelude::AccountInfo,
	solana_program_test::*,
};

// Type alias for the entry function pointer used to convert the entry function into a ProcessInstruction function pointer.
pub type ProgramEntry = for<'info> fn(
	program_id: &Pubkey,
	accounts: &'info [AccountInfo<'info>],
	instruction_data: &[u8],
) -> ProgramResult;

// Macro to convert the entry function into a ProcessInstruction function pointer.
#[macro_export]
macro_rules! convert_entry {
	($entry:expr) => {
		// Use unsafe block to perform memory transmutation.
		unsafe { core::mem::transmute::<ProgramEntry, ProcessInstruction>($entry) }
	};
}

pub fn get_program_test() -> ProgramTest {
	let program_test = ProgramTest::new(
		"woofi",
		PROGRAM_ID,
		processor!(convert_entry!(entry)),
	);
	program_test
}
	
pub mod woofi_ix_interface {

	use {
		solana_sdk::{
			hash::Hash,
			signature::{Keypair, Signer},
			instruction::Instruction,
			pubkey::Pubkey,
			transaction::Transaction,
		},
		woofi::{
			ID as PROGRAM_ID,
			accounts as woofi_accounts,
			instruction as woofi_instruction,
		},
		anchor_lang::{
			prelude::*,
			InstructionData,
		}
	};

	pub fn initialize_platform_ix_setup(
		admin: &Keypair,
		platform: Pubkey,
		system_program: Pubkey,
		treasury: Pubkey,
		recent_blockhash: Hash,
	) -> Transaction {
		let accounts = woofi_accounts::InitializePlatform {
			admin: admin.pubkey(),
			platform: platform,
			system_program: system_program,
		};

		let data = 	woofi_instruction::InitializePlatform {
				treasury,
		};		let instruction = Instruction::new_with_bytes(PROGRAM_ID, &data.data(), accounts.to_account_metas(None));
		let mut transaction = Transaction::new_with_payer(
			&[instruction], 
			Some(&admin.pubkey()),
		);

		transaction.sign(&[
			&admin,
		], recent_blockhash);

		return transaction;
	}

	pub fn add_dog_ix_setup(
		admin: &Keypair,
		platform: Pubkey,
		dog: Pubkey,
		system_program: Pubkey,
		name: &String,
		age: u8,
		image_url: &String,
		story: &String,
		needs_food: bool,
		needs_toys: bool,
		needs_medical: bool,
		needs_shelter: bool,
		needs_other: &String,
		recent_blockhash: Hash,
	) -> Transaction {
		let accounts = woofi_accounts::AddDog {
			admin: admin.pubkey(),
			platform: platform,
			dog: dog,
			system_program: system_program,
		};

		let data = 	woofi_instruction::AddDog {
				name: name.clone(),
				age,
				image_url: image_url.clone(),
				story: story.clone(),
				needs_food,
				needs_toys,
				needs_medical,
				needs_shelter,
				needs_other: needs_other.clone(),
		};		let instruction = Instruction::new_with_bytes(PROGRAM_ID, &data.data(), accounts.to_account_metas(None));
		let mut transaction = Transaction::new_with_payer(
			&[instruction], 
			Some(&admin.pubkey()),
		);

		transaction.sign(&[
			&admin,
		], recent_blockhash);

		return transaction;
	}

	pub fn update_dog_ix_setup(
		admin: &Keypair,
		dog: Pubkey,
		image_url: &String,
		story: &String,
		needs_food: bool,
		needs_toys: bool,
		needs_medical: bool,
		needs_shelter: bool,
		needs_other: &String,
		active: bool,
		recent_blockhash: Hash,
	) -> Transaction {
		let accounts = woofi_accounts::UpdateDog {
			admin: admin.pubkey(),
			dog: dog,
		};

		let data = 	woofi_instruction::UpdateDog {
				image_url: image_url.clone(),
				story: story.clone(),
				needs_food,
				needs_toys,
				needs_medical,
				needs_shelter,
				needs_other: needs_other.clone(),
				active,
		};		let instruction = Instruction::new_with_bytes(PROGRAM_ID, &data.data(), accounts.to_account_metas(None));
		let mut transaction = Transaction::new_with_payer(
			&[instruction], 
			Some(&admin.pubkey()),
		);

		transaction.sign(&[
			&admin,
		], recent_blockhash);

		return transaction;
	}

	pub fn donate_ix_setup(
		donor: &Keypair,
		platform: Pubkey,
		dog: Pubkey,
		donation: Pubkey,
		treasury: Pubkey,
		system_program: Pubkey,
		amount: u64,
		message: &String,
		timestamp: i64,
		recent_blockhash: Hash,
	) -> Transaction {
		let accounts = woofi_accounts::Donate {
			donor: donor.pubkey(),
			platform: platform,
			dog: dog,
			donation: donation,
			treasury: treasury,
			system_program: system_program,
		};

		let data = 	woofi_instruction::Donate {
				amount,
				message: message.clone(),
				timestamp,
		};		let instruction = Instruction::new_with_bytes(PROGRAM_ID, &data.data(), accounts.to_account_metas(None));
		let mut transaction = Transaction::new_with_payer(
			&[instruction], 
			Some(&donor.pubkey()),
		);

		transaction.sign(&[
			&donor,
		], recent_blockhash);

		return transaction;
	}

	pub fn withdraw_funds_ix_setup(
		admin: &Keypair,
		platform: Pubkey,
		treasury: Pubkey,
		recipient: Pubkey,
		amount: u64,
		recent_blockhash: Hash,
	) -> Transaction {
		let accounts = woofi_accounts::WithdrawFunds {
			admin: admin.pubkey(),
			platform: platform,
			treasury: treasury,
			recipient: recipient,
		};

		let data = 	woofi_instruction::WithdrawFunds {
				amount,
		};		let instruction = Instruction::new_with_bytes(PROGRAM_ID, &data.data(), accounts.to_account_metas(None));
		let mut transaction = Transaction::new_with_payer(
			&[instruction], 
			Some(&admin.pubkey()),
		);

		transaction.sign(&[
			&admin,
		], recent_blockhash);

		return transaction;
	}

}
