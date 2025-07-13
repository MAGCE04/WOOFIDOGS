use anchor_lang::prelude::*;
use solana_program_test::*;
use solana_sdk::{
    account::Account,
    pubkey::Pubkey,
    signature::{Keypair, Signer},
    system_program,
    transaction::Transaction,
};
use std::str::FromStr;
use woofi::{state::*, ID as PROGRAM_ID};

// Helper function to set up the program test environment
pub fn setup_program_test() -> ProgramTest {
    let mut program_test = ProgramTest::new("woofi", PROGRAM_ID, processor!(woofi::entry));
    program_test
}

// Helper function to get the program ID
pub fn program_id() -> Pubkey {
    PROGRAM_ID
}

// Helper function to airdrop SOL to an account
pub async fn airdrop(
    banks_client: &mut BanksClient,
    payer: &Keypair,
    recent_blockhash: &solana_sdk::hash::Hash,
    pubkey: &Pubkey,
    amount: u64,
) {
    let transaction = Transaction::new_signed_with_payer(
        &[solana_sdk::system_instruction::transfer(
            &payer.pubkey(),
            pubkey,
            amount,
        )],
        Some(&payer.pubkey()),
        &[payer],
        *recent_blockhash,
    );

    banks_client
        .process_transaction(transaction)
        .await
        .expect("airdrop failed");
}

// Helper function to find the platform PDA
pub fn find_platform_pda() -> (Pubkey, u8) {
    Pubkey::find_program_address(&[b"platform"], &program_id())
}

// Helper function to find a dog PDA
pub fn find_dog_pda(name: &str) -> (Pubkey, u8) {
    Pubkey::find_program_address(&[b"dog", name.as_bytes()], &program_id())
}

// Helper function to find a donation PDA
pub fn find_donation_pda(donor: &Pubkey, timestamp: i64) -> (Pubkey, u8) {
    let timestamp_bytes = timestamp.to_le_bytes();
    Pubkey::find_program_address(
        &[b"donation", donor.as_ref(), &timestamp_bytes],
        &program_id(),
    )
}

// Helper function to create a platform account
pub async fn create_platform(
    banks_client: &mut BanksClient,
    payer: &Keypair,
    recent_blockhash: &solana_sdk::hash::Hash,
    admin: &Keypair,
    treasury: &Pubkey,
) -> Result<(), BanksClientError> {
    let (platform_pda, _) = find_platform_pda();

    let initialize_ix = Instruction {
        program_id: program_id(),
        accounts: vec![
            AccountMeta::new(admin.pubkey(), true),
            AccountMeta::new(platform_pda, false),
            AccountMeta::new_readonly(system_program::id(), false),
        ],
        data: anchor_lang::InstructionData::new(
            anchor_lang::Discriminator::new("initialize_platform"),
            woofi::instruction::InitializePlatform {
                treasury: *treasury,
            },
        )
        .to_vec(),
    };

    let transaction = Transaction::new_signed_with_payer(
        &[initialize_ix],
        Some(&payer.pubkey()),
        &[payer, admin],
        *recent_blockhash,
    );

    banks_client.process_transaction(transaction).await
}

// Helper function to add a dog
pub async fn add_dog(
    banks_client: &mut BanksClient,
    payer: &Keypair,
    recent_blockhash: &solana_sdk::hash::Hash,
    admin: &Keypair,
    name: &str,
    age: u8,
    image_url: &str,
    story: &str,
    needs_food: bool,
    needs_toys: bool,
    needs_medical: bool,
    needs_shelter: bool,
    needs_other: &str,
) -> Result<(), BanksClientError> {
    let (platform_pda, _) = find_platform_pda();
    let (dog_pda, _) = find_dog_pda(name);

    let add_dog_ix = Instruction {
        program_id: program_id(),
        accounts: vec![
            AccountMeta::new(admin.pubkey(), true),
            AccountMeta::new(platform_pda, false),
            AccountMeta::new(dog_pda, false),
            AccountMeta::new_readonly(system_program::id(), false),
        ],
        data: anchor_lang::InstructionData::new(
            anchor_lang::Discriminator::new("add_dog"),
            woofi::instruction::AddDog {
                name: name.to_string(),
                age,
                image_url: image_url.to_string(),
                story: story.to_string(),
                needs_food,
                needs_toys,
                needs_medical,
                needs_shelter,
                needs_other: needs_other.to_string(),
            },
        )
        .to_vec(),
    };

    let transaction = Transaction::new_signed_with_payer(
        &[add_dog_ix],
        Some(&payer.pubkey()),
        &[payer, admin],
        *recent_blockhash,
    );

    banks_client.process_transaction(transaction).await
}