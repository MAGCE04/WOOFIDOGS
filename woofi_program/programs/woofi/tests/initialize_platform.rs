use anchor_lang::prelude::*;
use solana_program_test::*;
use solana_sdk::{signature::Keypair, signer::Signer};
use woofi::state::Platform;

mod common;
use common::*;

#[tokio::test]
async fn test_initialize_platform() {
    // Set up the test environment
    let mut program_test = setup_program_test();
    let (mut banks_client, payer, recent_blockhash) = program_test.start().await;

    // Create a new keypair for the admin
    let admin = Keypair::new();
    airdrop(&mut banks_client, &payer, &recent_blockhash, &admin.pubkey(), 10_000_000_000).await;

    // Create a new keypair for the treasury
    let treasury = Keypair::new();
    
    // Find the platform PDA
    let (platform_pda, _) = find_platform_pda();

    // Create the platform
    let result = create_platform(
        &mut banks_client,
        &payer,
        &recent_blockhash,
        &admin,
        &treasury.pubkey(),
    )
    .await;
    
    assert!(result.is_ok(), "Failed to initialize platform: {:?}", result);

    // Verify the platform account was created correctly
    let platform_account = banks_client
        .get_account(platform_pda)
        .await
        .expect("Failed to get platform account")
        .expect("Platform account not found");

    // Deserialize the platform account data
    let platform = Platform::try_deserialize(&mut platform_account.data.as_ref())
        .expect("Failed to deserialize platform account");

    // Verify the platform data
    assert_eq!(platform.admin, admin.pubkey(), "Admin pubkey mismatch");
    assert_eq!(platform.treasury, treasury.pubkey(), "Treasury pubkey mismatch");
    assert_eq!(platform.total_donations, 0, "Total donations should be 0");
    assert_eq!(platform.dog_count, 0, "Dog count should be 0");
    assert_eq!(platform.donation_count, 0, "Donation count should be 0");
}

#[tokio::test]
async fn test_initialize_platform_invalid_treasury() {
    // Set up the test environment
    let mut program_test = setup_program_test();
    let (mut banks_client, payer, recent_blockhash) = program_test.start().await;

    // Create a new keypair for the admin
    let admin = Keypair::new();
    airdrop(&mut banks_client, &payer, &recent_blockhash, &admin.pubkey(), 10_000_000_000).await;

    // Find the platform PDA
    let (platform_pda, _) = find_platform_pda();

    // Try to initialize with system program as treasury (should fail)
    let initialize_ix = Instruction {
        program_id: program_id(),
        accounts: vec![
            AccountMeta::new(admin.pubkey(), true),
            AccountMeta::new(platform_pda, false),
            AccountMeta::new_readonly(solana_program::system_program::id(), false),
        ],
        data: anchor_lang::InstructionData::new(
            anchor_lang::Discriminator::new("initialize_platform"),
            woofi::instruction::InitializePlatform {
                treasury: solana_program::system_program::id(),
            },
        )
        .to_vec(),
    };

    // Create and sign the transaction
    let transaction = Transaction::new_signed_with_payer(
        &[initialize_ix],
        Some(&admin.pubkey()),
        &[&admin],
        recent_blockhash,
    );

    // Process the transaction - should fail
    let result = banks_client.process_transaction(transaction).await;
    assert!(result.is_err(), "Should fail with invalid treasury");
}