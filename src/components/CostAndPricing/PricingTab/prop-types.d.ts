import type {
  AlertProps,
  ButtonProps,
  DialogProps,
  FabProps,
  IconButtonProps,
  TooltipProps,
} from '@mui/material';
import type { CellContext, HeaderContext, Table } from '@tanstack/react-table';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { Product, Quote } from './data-types';

export type CellProps<TValue> = CellContext<Product, TValue>;
export type HeaderProps<TValue> = HeaderContext<Product, TValue>;

export interface PricingTableProps {
  /** The current quote */
  readonly quote: Quote;
  /** React setter for the quote */
  readonly setQuote: Dispatch<SetStateAction<Quote>>;
}

export interface TotalsTableProps {
  /** The current quote */
  readonly quote: Quote;
  /** The table of products */
  readonly table: Table<Product>;
  /** React setter for the quote */
  readonly setQuote: Dispatch<SetStateAction<Quote>>;
}

export interface SimpleTotalsTableRowProps {
  /** The table of products */
  readonly table: Table<Product>;
  readonly column: string;
  readonly title: string;
}

export interface ContributionRowsProps {
  readonly slots: {
    readonly marginInput: ReactNode;
  };
  readonly state: {
    readonly manualPrice: number;
  };
  readonly profitMarginTotalPrice: number;
  readonly totalVariableCosts: number;
  readonly estimatedTotalHours: number;
}

export interface AddProductCellProps {
  /** The table of products */
  readonly table: Table<Product>;
}

export interface QuoteActionGroupProps {
  /** The current quote */
  readonly quote: Quote;
  /** React setter for the quote */
  readonly setQuote: Dispatch<SetStateAction<Quote>>;
}

export interface SaveQuoteProps {
  /** The current quote */
  readonly quote: Quote;
  /** React setter for the quote */
  readonly setQuote: Dispatch<SetStateAction<Quote>>;
}

export interface UpdateQuoteProps {
  /** The current quote */
  readonly quote: Quote;
}

export interface ClearQuoteProps {
  /** React setter for the quote */
  readonly setQuote: Dispatch<SetStateAction<Quote>>;
}

export interface InputExtraProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

export interface BaseDialogProps {
  /** Whether the dialog is open */
  readonly open: boolean;
  /** The dialog title */
  readonly title: ReactNode;
  /** The dialog content */
  readonly children: ReactNode;
  /** The dialog actions */
  readonly actions: ReactNode;
  /**
   * The dialog close handler.
   * It should also close the form.
   */
  readonly onClose: Required<DialogProps>['onClose'];
  /**
   * The function to run on form submission.
   * It should also close the form.
   */
  readonly onSubmit: () => void;
  /** The snackbar message to show on submission/confirmation */
  readonly snackbarMessage?: ReactNode;
  /** The props for the snackbar */
  readonly SnackbarProps?: Omit<DialogSnackbarProps, 'open' | 'onClose'>;
}

export interface ConfirmDlaogProps
  extends Omit<BaseDialogProps, 'onSubmit' | 'children' | 'actions'> {
  /** The text content for the dialog */
  readonly text: ReactNode;
  /** The text for the cancel button */
  readonly cancelText?: ReactNode;
  /** The text for the confirm button */
  readonly confirmText?: ReactNode;
  /** The props for the cancel button */
  readonly CancelProps?: ButtonProps;
  /** The props for the confirm button */
  readonly ConfirmProps?: ButtonProps;
  /** The function to run on cancellation */
  readonly onCancel: () => void;
  /** The function to run on confirmation */
  readonly onConfirm: () => void;
}

export interface ConfirmButtonDialogProps
  extends Omit<ConfirmDlaogProps, 'open' | 'onClose' | 'onCancel'>,
    Partial<Pick<ConfirmDlaogProps, 'onCancel'>> {
  /** A function to run when closing the dialog */
  readonly onClose?: () => void;
  /** What kind of button to use */
  readonly buttonType: 'button' | 'icon' | 'fab';
  /** The text for the button */
  readonly buttonText: ReactNode;
  /** The props for the button */
  readonly ButtonProps?: Omit<ButtonProps, 'onClick'>;
  /** The props for the tooltip */
  readonly TooltipProps?: Omit<TooltipProps, 'children'>;
  /** The props for the icon button */
  readonly IconProps?: Omit<IconButtonProps, 'onClick'>;
  /** The props for the fab */
  readonly FabProps?: Omit<FabProps, 'onClick'>;
}

export interface DialogSnackbarProps {
  /** Whether the snackbar is open */
  readonly open: boolean;
  readonly children: ReactNode;
  /** The severity for the alert within the snackbar */
  readonly severity?: AlertProps['severity'];
  /** The function to run when closing the snackbar */
  readonly onClose: () => void;
  /** The time after which to hide the snackbar */
  readonly autoHideDuration?: number;
}

export interface NumberFormatterProps {
  /** A number */
  readonly value?: number;
  /** How to present the number */
  readonly variant?: 'currency' | 'accounting' | 'percent' | 'number';
}
