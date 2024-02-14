import { InputProps, TableCellProps } from '@mui/material';
import { RowData } from '@tanstack/table-core';
import { Dispatch, SetStateAction } from 'react';
import { NumericFormatProps } from 'react-number-format';
import { Product, Quote } from './data-types';

// This .d.ts file lets us define properties on the table's meta option
declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    /** A react state setter for a quote */
    setQuote: Dispatch<SetStateAction<Quote>>;
    /** Whether the quote is in update mode */
    updateMode: boolean;
    /** The dymanic cost names for a quote */
    costNames: string[];
  }
  interface ColumnMeta<TData extends RowData, TValue> {
    /** What input mode the table cell should used */
    inputMode?: InputProps['inputMode'];
    /** What the left input adornment should be */
    adornment?: string;
    /** What the name of the cost is */
    costName?: string;
    /** What key of a product to edit */
    productKey?: keyof Omit<Product, 'costs' | 'name'>;
    /** What variant to use for cells in a column def */
    cellVariant?: TableCellProps['variant'];
    /** What variant to use for footers in a column def */
    footerVariant?: TableCellProps['variant'];
    /** The column ID for calculated contribution columns */
    footerContribDivisor?: keyof Omit<Product, 'id' | 'costs' | 'name'>;
    /** How to display the calculated contribution */
    footerContribFormat?: 'percent' | 'currency' | 'accounting' | 'number';
    /** Props for react-number-format */
    inputProps?: NumericFormatProps;
  }
}
