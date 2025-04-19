use anchor_lang::prelude::*;

declare_id!("2ZcYtu6b6P6rKXittUPvncSaLRuEtNSoqeRc9RVCHY4q");

#[program]
pub mod contracts {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
