use anchor_lang::prelude::*;

declare_id!("3YZMgcQTSYXeQd6Ma7WRDGRMMZFd29m5Vdr1DHFqq7qW");

#[program]
pub mod contracts {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
