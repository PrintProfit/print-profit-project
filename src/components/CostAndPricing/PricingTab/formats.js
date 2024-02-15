// @ts-check

/**
 * Formats a number as a percent.
 * @type {import("./data-types").NumberFmtFn}
 */
export const percent = (n) => {
  return Number.isFinite(n)
    ? n?.toLocaleString(undefined, { style: 'percent' })
    : undefined;
};

/**
 * Formats a number as a currency.
 * @type {import("./data-types").NumberFmtFn}
 */
export const currency = (n) => {
  return Number.isFinite(n)
    ? n?.toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
      })
    : undefined;
};

/**
 * Formats a number as a currency with accounting style.
 * @type {import("./data-types").NumberFmtFn}
 */
export const accounting = (n) => {
  return Number.isFinite(n)
    ? n?.toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
        currencySign: 'accounting',
      })
    : undefined;
};

/**
 * Formats a number as a number.
 * @type {import("./data-types").NumberFmtFn}
 */
export const number = (n) => {
  return Number.isFinite(n) ? n?.toLocaleString() : undefined;
};
