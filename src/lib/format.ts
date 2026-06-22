
/**
 * Formats a number as Nepali Rupees for display.
 *
 * Crawled prices (current_price, last_price, etc.) are always whole-
 * rupee integers — Daraz doesn't list paisa — so this defaults to 0
 * decimal places. Pass { decimals: 2 } only if you ever need fractional
 * values (e.g. a computed average).
 *
 * Uses a literal "Rs. " prefix instead of Intl's NPR currency style,
 * because Intl.NumberFormat(..., { style: 'currency', currency: 'NPR' })
 * renders inconsistently across browsers/Node ICU builds (some emit
 * "NPR 96,999", others "₨96,999") — neither matches what users expect
 * from a Nepali storefront.
 */
export function formatCurrency(
  value: number | null | undefined,
  options?: { decimals?: number }
): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "Rs. —";
  }

  const decimals = options?.decimals ?? 0;
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

  return `Rs. ${formatted}`;
}

/**
 * Formats a discount/percentage value (e.g. "11%").
 * Guards against undefined (new products with no price_history yet)
 * and treats negative values (price rose, not dropped) as 0 rather
 * than showing a nonsensical "-5% OFF" badge.
 */
export function formatPercentage(
  value: number | null | undefined,
  options?: { showSign?: boolean }
): string {
  if (value === null || value === undefined || Number.isNaN(value) || value < 0) {
    return "0%";
  }
  const rounded = Math.round(value);
  const sign = options?.showSign ? "+" : "";
  return `${sign}${rounded}%`;
}