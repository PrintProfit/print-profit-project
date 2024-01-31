// I need this

import type { ColumnDef } from '@tanstack/react-table';

export interface Cost {
  name: string;
  value: number;
}

export interface Product {
  name: string;
  quantity: number;
  selling_price: number;
  total_selling_price: number;
  estimated_hours: number;
  costs: Cost[];
}

export interface Quote {
  name: string;
  products: Product[];
}

export type ProductColumnDef = ColumnDef<Product>;
