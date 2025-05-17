# SolX Contracts

This directory contains the SolX smart contract program, written in Rust using the [Anchor framework](https://www.anchor-lang.com/docs). The contract implements the core logic for creating and managing NFT-based listings on Solana.

## Overview

The SolX contract allows users to create, list, and manage NFTs (Non-Fungible Tokens) representing unique assets. The contract handles minting NFTs, associating metadata, managing listings, enforcing access control via whitelisting and global state, as well as supporting collateralized transactions and dispute resolution.

## Key Features

- **Minting NFTs:** Users can mint new NFTs with custom metadata. The minting process uses the SPL Token and Metaplex Token Metadata standards.
- **Listings:** Each NFT can be listed for sale or other purposes. Listings are tracked on-chain with unique IDs.
- **Vault Management:** A program-controlled vault account is used to securely manage assets and authority over minted NFTs.
- **Whitelisting:** The contract supports whitelisting, allowing only approved users to perform certain actions.
- **Collateral Management:** Listings can require collateral deposits from participants to ensure commitment and reduce risk.
- **Dispute Resolution:** The contract provides mechanisms for disputing transactions, allowing parties to raise disputes and resolve them according to on-chain logic.
- **Event Emission:** Events such as `ListingCreated` are emitted for off-chain tracking and indexing.

## Main Accounts

- **GlobalState:** Stores global configuration and state for the contract.
- **Listing:** Represents an individual NFT listing, including its state, metadata, collateral requirements, and dispute status.
- **Vault:** A program-derived account that acts as the authority for minting and freezing NFTs, and holds collateral funds.
- **WhitelistedState:** Tracks whitelisted users.

## Main Instructions

### MintNft

Mints a new NFT and creates a listing.

**Accounts:**

- `payer`: Funds the transaction and account creation.
- `lister`: The user creating the listing.
- `global_state`: The global state account.
- `vault`: The program's vault account (PDA).
- `nft_mint`: The new NFT mint account (PDA).

**Process:**

1. Initializes a new mint for the NFT, with the vault as authority.
2. Creates associated token accounts for the lister.
3. Mints the NFT to the lister's account.
4. Creates and sets metadata using Metaplex.
5. Emits a `ListingCreated` event.

### Collateralized Listings

When creating a listing, the contract can require a collateral deposit from the lister or the buyer. This collateral is held in the vault account and is only released when the transaction is successfully completed or resolved. Collateral helps ensure that both parties are committed to the transaction and provides a financial incentive to act honestly.

- **Depositing Collateral:** During listing creation or offer acceptance, the required collateral amount is transferred to the vault.
- **Releasing Collateral:** Upon successful completion of the transaction, collateral is returned to the rightful party.
- **Forfeiting Collateral:** In case of a dispute or breach of agreement, collateral may be forfeited according to the contract's dispute resolution logic.

### Dispute Resolution

The contract supports on-chain dispute resolution to handle disagreements between parties (e.g., buyer and seller).

- **Raising a Dispute:** Either party can raise a dispute if they believe the terms of the transaction were not met. This updates the listing's state to "disputed."
- **Resolving a Dispute:** Disputes can be resolved by an authorized party (e.g., an admin or arbitrator) or through predefined contract logic. The resolution determines the final distribution of assets and collateral.
- **Outcomes:** Depending on the resolution, collateral may be refunded, partially refunded, or forfeited to the counterparty.

### Other Instructions

- **Transfer:** Handles secure transfer of NFTs or SOL between accounts.
- **Whitelisting:** Adds or removes assets from the whitelist.
- **State Management:** Updates listing state (e.g., active, sold, cancelled, disputed, resolved).

## Error Handling

Custom errors are defined in `error.rs` and returned for invalid actions, such as unauthorized access, insufficient collateral, or invalid state transitions.

## Development

The contract is built with:

- Anchor Framework v0.28.0
- Rust v1.78.0 - v1.89.0
- Solana CLI v1.18.0 - v2.0.0

### Prerequisites

- [Rust](https://www.rust-lang.org/)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
- [Anchor CLI](https://www.anchor-lang.com/docs/installation)

### Build & Test

This section explains how to use the Anchor CLI to compile and test the smart contract program:

```
anchor build
anchor run test
```
