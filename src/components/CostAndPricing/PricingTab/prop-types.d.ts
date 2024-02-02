import type { Column, Getter, Row, Table } from '@tanstack/react-table';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { Product, Quote } from './data-types';

export interface DynamicCostCellProps<T> {
  /** the getValue function from tanstack tables */
  readonly getValue: Getter<T>;
  /** the index of the cost in the product. */
  readonly costIndex: number;
  /** the table the cell is in */
  readonly table: Table<Product>;
  /** the row the cell is in */
  readonly row: Row<Product>;
}

export interface ConsistentNumericCellProps<T> {
  /** the getValue function from tanstack tables */
  readonly getValue: Getter<T>;
  /** the table the cell is in */
  readonly table: Table<Product>;
  /** the row the cell is in */
  readonly row: Row<Product>;
  /** the column the cell is in */
  readonly column: Column<Product>;
}

export interface PricingTableProps {
  readonly quote: Quote;
  readonly setQuote: Dispatch<SetStateAction<Quote>>;
}

export interface TotalsTableProps {
  readonly quote: Quote;
  readonly table: Table<Product>;
}

export interface TotalsTableRowProps {
  readonly table: Table<Product>;
  readonly column: string;
}

export interface ContributionRowsProps {
  readonly slots: {
    readonly marginInput: ReactNode;
  };
  readonly state: {
    readonly manualPrice: number;
    readonly pricePerItem: number;
  };
  readonly profitMarginTotalPrice: number;
  readonly totalVariableCosts: number;
  readonly estimatedTotalHours: number;
}

export interface ProductNameCellProps {
  /** the getValue function from tanstack tables */
  readonly getValue: Getter<string>;
  /** the table the cell is in */
  readonly table: Table<Product>;
  /** the row the cell is in */
  readonly row: Row<Product>;
}

export interface DollarCellProps {
  readonly getValue: Getter<number>;
}

export interface PercentCellProps {
  readonly getValue: Getter<number>;
}

export interface AddCostHeaderProps {
  readonly table: Table<Product>;
}

export interface AddProductCellProps {
  readonly table: Table<Product>;
}
