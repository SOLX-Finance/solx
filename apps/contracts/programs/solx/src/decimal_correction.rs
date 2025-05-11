/// A utility struct for converting token amounts between different decimal precisions.
///
/// This is useful when working with tokens that use different decimal formats,
/// e.g., converting between 6, 8, or 9 decimals for compatibility.
pub struct DecimalsCorrection;

impl DecimalsCorrection {
    /// Converts an `original_amount` from `original_decimals` to `decided_decimals`.
    ///
    /// Returns `None` if the conversion factor overflows.
    ///
    /// # Arguments
    ///
    /// * `original_amount` - The raw token amount to convert.
    /// * `original_decimals` - The number of decimals of the original token.
    /// * `decided_decimals` - The number of decimals to convert the amount into.
    ///
    /// # Example
    ///
    /// ```
    /// let result = DecimalsCorrection::convert(1_000_000_000, 9, 6);
    /// assert_eq!(result, Some(1_000_000));
    /// ```
    pub fn convert(
        original_amount: u128,
        original_decimals: u8,
        decided_decimals: u8,
    ) -> Option<u128> {
        if original_amount == 0 {
            return Some(0);
        }
        if original_decimals == decided_decimals {
            return Some(original_amount);
        }

        if original_decimals > decided_decimals {
            let factor = 10u128.checked_pow((original_decimals - decided_decimals) as u32)?;
            original_amount.checked_div(factor)
        } else {
            let factor = 10u128.checked_pow((decided_decimals - original_decimals) as u32)?;
            original_amount.checked_mul(factor)
        }
    }

    /// Converts `original_amount` from base-9 decimals to the desired decimals.
    ///
    /// # Example
    ///
    /// ```
    /// let result = DecimalsCorrection::convert_from_base9(1_000_000_000, 6);
    /// assert_eq!(result, Some(1_000_000));
    /// ```
    pub fn convert_from_base9(original_amount: u128, decided_decimals: u8) -> Option<u128> {
        Self::convert(original_amount, 9, decided_decimals)
    }

    /// Converts `original_amount` from a given decimal format to base-9 decimals.
    ///
    /// # Example
    ///
    /// ```
    /// let result = DecimalsCorrection::convert_to_base9(1_000_000, 6);
    /// assert_eq!(result, Some(1_000_000_000));
    /// ```
    pub fn convert_to_base9(original_amount: u128, original_decimals: u8) -> Option<u128> {
        Self::convert(original_amount, original_decimals, 9)
    }
}
