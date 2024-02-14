// I need this

import type { ColumnDef } from '@tanstack/react-table';

/**
 * Extreme partial type.
 *
 * TypeScript's Partial type is insufficient for our purposes, as the server
 * can send data that has values being *explicitly* `null`.
 *
 * This type makes it so that every property can be `undefined` or `null`.
 * @see {@link https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype Partial - TypeScript Utility Types}
 */
type DamagedStruct<T> = {
  [P in keyof T]?: T[P] | null;
};

/** A cost for a product */
export interface Cost {
  /** The ID for a cost that was recieved from the server */
  id?: number;
  /** The name for the cost. It must be unique to the product. */
  name: string;
  /** The value for the cost. */
  value: number;
}

/** Incomplete `Cost` from the server */
export type DamagedCost = DamagedStruct<Cost>;

/** A product from a quote */
export interface Product {
  /** The ID for a product that was recieved from the server */
  id?: number;
  /** The product name */
  name: string;
  /** The quantity of a product, which should be an integer */
  quantity: number;
  /** The selling price for a product */
  selling_price_per_unit: number;
  /**
   * The total selling price for a product.
   * If undefined, it should be calculated from the `quantity` and `selling_price_per_unit`.
   */
  total_selling_price?: number;
  estimated_hours: number;
  /** The user-editable costs for a product */
  costs: Cost[];
}

/** Incomplete `Product` from the server */
export type DamagedProduct = DamagedStruct<
  Omit<Product, 'costs'> & {
    costs?: DamagedCost[];
  }
>;

/** A full quote */
export interface Quote {
  /** The ID for a quote from the server, which is needed to update a quote. */
  id?: number;
  /** The name of a quote */
  name: string;
  /** The user's target contribution precentage */
  manual_contribution_percent?: number;
  /** The user's custom selling price */
  manual_total_selling_price?: number;
  inserted_at?: string;
  created_by?: string;
  /** The products for a quote */
  products: Product[];
}

/**
 * This type represents the absolute maximum degree of bad data the client
 * can accept from the server. Every property can be null or undefined.
 */
export type DamaagedQuote =
  | DamagedStruct<
      Omit<Quote, 'products'> & {
        products?: DamagedProduct[];
      }
    >
  | undefined
  | null;

/** Helper type for JSDoc comments */
export type ProductColumnDef<TValue = unknown> = ColumnDef<Product, TValue>;
