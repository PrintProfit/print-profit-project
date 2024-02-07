// @ts-check

import { emptyQuote } from './sample-data';

/**
 * Repairs potentially broken quotes recieved from the server.
 * @param {import("./data-types").DamaagedQuote} quote
 * @returns {import("./data-types").Quote}
 */
export function repairQuote(quote) {
  // If the quote is undefined or null, return the default quote
  if (quote === undefined || quote === null) {
    return emptyQuote;
  }
  return {
    id: quote.id ?? undefined,
    name: quote.name ?? '',
    manual_contribution_percent: quote.manual_contribution_percent ?? 0,
    manual_total_selling_price: quote.manual_total_selling_price ?? undefined,
    // The inserted_at and created_by fields are dropped hre
    products: (quote.products ?? []).map(repairProduct),
  };
}

/**
 * Repairs a broken product from a quote
 * @param {import('./data-types').DamagedProduct} product
 * @returns {import('./data-types').Product}
 */
function repairProduct(product) {
  return {
    id: product.id ?? undefined,
    name: product.name ?? 'Unnamed Product',
    quantity: product.quantity ?? 0,
    selling_price_per_unit: product.selling_price_per_unit ?? 0,
    total_selling_price: product.total_selling_price ?? undefined,
    estimated_hours: product.estimated_hours ?? 0,
    costs: (product.costs ?? []).map(repairCost),
  };
}

/**
 * Repairs a broken cost from a product
 * @param {import('./data-types').DamagedCost} cost
 * @returns {import('./data-types').Cost}
 */
function repairCost(cost) {
  return {
    id: cost.id ?? undefined,
    name: cost.name ?? 'Unnamed Cost',
    value: cost.value ?? 0,
  };
}
