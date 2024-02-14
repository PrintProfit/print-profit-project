// @ts-check

/**
 * type imports
 * @typedef {import("./data-types").Product} Product
 */

const CREDIT_CARD_FEE = 0.03;

/**
 * Calculate's the credit card fee for a product
 * @param {Product} product
 * @returns {number}
 */
export function totalSellingPrice(product) {
  return (
    product.total_selling_price ??
    product.selling_price_per_unit * product.quantity
  );
}

/**
 * Calculate's the credit card fee for a product
 * @param {Product} product
 * @returns {number}
 */
export function creditCardFee(product) {
  return totalSellingPrice(product) * CREDIT_CARD_FEE;
}

/**
 * Get the sum of the variable costs for a product, excluding the credit card fee
 * @param {import("./data-types").Cost[]} costs
 * @returns {number}
 */
function sumCosts(costs) {
  return costs.reduce((sum, cost) => sum + cost.value, 0);
}

/**
 * @param {Product} product
 * @returns {number}
 */
export function totalVariableCosts(product) {
  return sumCosts(product.costs ?? []) + creditCardFee(product);
}

/**
 * @param {Product} product
 * @returns {number}
 */
export function contribution(product) {
  return totalSellingPrice(product) - totalVariableCosts(product);
}

/**
 * @param {Product} product
 * @returns {number}
 */
export function contributionMargin(product) {
  return contribution(product) / totalSellingPrice(product);
}

/**
 * @param {Product} product
 * @returns {number}
 */
export function contributionPerHour(product) {
  return contribution(product) / product.estimated_hours;
}
