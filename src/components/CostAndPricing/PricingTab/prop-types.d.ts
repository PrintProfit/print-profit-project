import type { Getter } from '@tanstack/react-table';
import type { Dispatch, SetStateAction } from 'react';
import type { Product, ProductColumnDef, Quote } from './data-types';

export interface DynamicCostCellProps<T> {
  /** the getValue function from tanstack tables */
  readonly getValue: Getter<T>;
  /** the setter for the entire quote */
  readonly setQuote: Dispatch<SetStateAction<Quote>>;
  /** the index of the product in the quote. */
  readonly productIndex: number;
  /** the index of the cost in the product. */
  readonly costIndex: number;
}

export interface ConsistentNumericCellProps<T> {
  /** the getValue function from tanstack tables */
  readonly getValue: Getter<T>;
  /** the setter for the entire quote */
  readonly setQuote: Dispatch<SetStateAction<Quote>>;
  /** the index of the product in the quote. */
  readonly productIndex: number;
  /** the key for the property in the product being modified. */
  readonly accessorKey:
    | 'quantity'
    | 'selling_price'
    | 'total_selling_price'
    | 'estimated_hours';
}

export interface PricingTableProps {
  readonly quote: Quote;
  readonly setQuote: Dispatch<SetStateAction<Quote>>;
}

export interface DataTableProps {
  readonly data: Product[];
  readonly columns: ProductColumnDef[];
}

export interface ProductNameCellProps {
  /** the getValue function from tanstack tables */
  readonly getValue: Getter<string>;
  /** the setter for the entire quote */
  readonly setQuote: Dispatch<SetStateAction<Quote>>;
  /** the index of the product in the quote. */
  readonly productIndex: number;
}

export interface DollarCellProps {
  readonly getValue: Getter<number>;
}
