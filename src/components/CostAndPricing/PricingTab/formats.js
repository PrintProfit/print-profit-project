// @ts-check

/**
 * Formats a number as a percent.
 * @param {number | undefined | null} [n]
 * @returns {string | undefined}
 */
export function percent(n) {
  return Number.isFinite(n)
    ? n?.toLocaleString(undefined, { style: 'percent' })
    : undefined;
}

/**
 * Formats a number as a currency.
 * @param {number | undefined | null} [n]
 * @returns {string | undefined}
 */
export function currency(n) {
  return Number.isFinite(n)
    ? n?.toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
      })
    : undefined;
}

/**
 * Formats a number as a currency with accounting style.
 * @param {number | undefined | null} [n]
 * @returns {string | undefined}
 */
export function accounting(n) {
  return Number.isFinite(n)
    ? n?.toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
        currencySign: 'accounting',
      })
    : undefined;
}
