use anchor_lang::prelude::*;
use pyth_solana_receiver_sdk::price_update::{
  get_feed_id_from_hex,
  Price,
  PriceUpdateV2,
};

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
