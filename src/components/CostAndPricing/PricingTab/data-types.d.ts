// I need this

import type { ColumnDef } from '@tanstack/react-table';

type DamagedStruct<T> = {
  [P in keyof T]?: T[P] | null;
};

export interface Cost {
  id?: number;
  name: string;
  value: number;
}

type DamagedCost = DamagedStruct<Cost>;

export interface Product {
  id?: number;
  name: string;
  quantity: number;
  selling_price_per_unit: number;
  total_selling_price?: number;
  estimated_hours: number;
  costs?: Cost[];
}

type DamagedProduct = DamagedStruct<
  Omit<Product, 'costs'> & {
    costs?: DamagedCost[];
  }
>;

export interface Quote {
  id?: number;
  name: string;
  manual_contribution_percent?: number;
  manual_total_selling_price?: number;
  inserted_at?: string;
  created_by?: string;
  products?: Product[];
}

// This type represents the absolute maximum degree of bad data the client
// can accept from the server. Every property can be null or undefined.
export type DamaagedQuote = DamagedStruct<
  Omit<Quote, 'products'> & {
    products?: DamagedProduct[];
  }
>;

export type ProductColumnDef = ColumnDef<Product>;
