use anchor_lang::prelude::*;
use pyth_solana_receiver_sdk::price_update::{
  get_feed_id_from_hex,
  Price,
  PriceUpdateV2,
};
use solana_program::{ program::{ invoke_signed }, system_instruction };

use crate::{ Listing, ListingState, PRICE_MAX_AGE };

pub fn get_currency<'info>(
  price_update: &Account<'info, PriceUpdateV2>,
  pyth_feed: String
) -> Result<(u64, u32)> {
  let feed_id: [u8; 32] = get_feed_id_from_hex(&pyth_feed)?;

  let price: Price = price_update.get_price_no_older_than(
    &Clock::get()?,
    PRICE_MAX_AGE as u64,
    &feed_id
  )?;

  let current_price = u64::try_from(price.price).unwrap();
  let price_exponent = price.exponent.abs() as u32;

  Ok((current_price, price_exponent))
}

pub fn get_timestamp() -> Result<u64> {
  let clock = Clock::get()?;
  Ok(clock.unix_timestamp as u64)
}

pub fn reset_listing(listing: &mut Listing) {
  listing.payment_mint = Pubkey::default();
  listing.buyer = Pubkey::default();
  listing.payment_amount = 0;
  listing.expiry_ts = 0;
  listing.state = ListingState::Opened;
}

pub fn send_sol<'a>(
  system_program: &AccountInfo<'a>,
  from: &AccountInfo<'a>,
  to: &AccountInfo<'a>,
  lamports: u64,
  signer_seeds: Option<&[&[&[u8]]]>
) -> Result<()> {
  let signer_seeds = signer_seeds.unwrap_or(&[&[]]);

  invoke_signed(
    &system_instruction::transfer(&from.key(), &to.key(), lamports),
    &[from.clone(), to.clone(), system_program.clone()],
    signer_seeds
  )?;

  Ok(())
}

pub fn bytes_to_uuid(bytes: [u8; 16]) -> String {
  fn hex_byte(b: u8) -> [u8; 2] {
    let hex = b"0123456789abcdef";
    let hi = hex[((b >> 4) & 0xf) as usize];
    let lo = hex[(b & 0xf) as usize];
    [hi, lo]
  }

  let mut out = [0u8; 36];
  let mut src_i = 0;
  let mut dst_i = 0;

  let dash_positions = [8, 13, 18, 23];
  let mut next_dash = dash_positions.iter();

  let mut dash_at = *next_dash.next().unwrap();

  while dst_i < 36 {
    if dst_i == dash_at {
      out[dst_i] = b'-';
      dash_at = *next_dash.next().unwrap_or(&36);
      dst_i += 1;
      continue;
    }
    let [hi, lo] = hex_byte(bytes[src_i]);
    out[dst_i] = hi;
    out[dst_i + 1] = lo;
    src_i += 1;
    dst_i += 2;
  }

  String::from_utf8_lossy(&out).into_owned()
}

pub fn transfer_lamports(
  from: &AccountInfo,
  to: &AccountInfo,
  amount: u64
) -> Result<()> {
  let mut from_lamports = from.try_borrow_mut_lamports()?;
  let mut to_lamports = to.try_borrow_mut_lamports()?;

  **from_lamports = from_lamports
    .checked_sub(amount)
    .ok_or(ProgramError::InsufficientFunds)?;
  **to_lamports = to_lamports
    .checked_add(amount)
    .ok_or(ProgramError::InvalidArgument)?;

  Ok(())
}
