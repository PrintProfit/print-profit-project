import { InputProps } from '@mui/material';
import { RowData } from '@tanstack/table-core';
import { Dispatch, SetStateAction } from 'react';
import { Quote } from './data-types';

// This .d.ts file lets us define properties on the table's meta option
declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    setQuote: Dispatch<SetStateAction<Quote>>;
  }
  interface ColumnMeta<TData extends RowData, TValue> {
    inputMode?: InputProps['inputMode'];
    adornment?: string;
    costIndex?: number;
  }
}
