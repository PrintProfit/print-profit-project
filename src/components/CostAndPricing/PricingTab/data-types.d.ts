// I need this

import type { ColumnDef } from '@tanstack/react-table';

export interface Cost {
  id?: number;
  name: string;
  value: number;
}

export interface Product {
  id?: number;
  name: string;
  quantity: number;
  selling_price_per_unit: number;
  total_selling_price?: number;
  estimated_hours: number;
  costs?: Cost[];
}

export interface Quote {
  id?: number;
  name: string;
  manual_contribution_percent?: number;
  manual_total_selling_price?: number;
  products: Product[];
}

export type ProductColumnDef = ColumnDef<Product>;
