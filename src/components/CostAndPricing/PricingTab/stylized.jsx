// @ts-check
import {
  TableRow,
  TextField,
  inputBaseClasses,
  lighten,
  styled,
  tableCellClasses,
} from '@mui/material';
import { indigo } from '@mui/material/colors';

export const PricingTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:has(input)': {
    backgroundColor: lighten(theme.palette.primary.main, 0.8),
  },
  '&:nth-of-type(even):has(input)': {
    backgroundColor: lighten(theme.palette.primary.main, 0.9),
  },
  [`& > .${tableCellClasses.head}`]: {
    // I really want to reduce the width of the head cells when they have
    // inputs in them, but I have no idea how to do that.
    borderRight: `1px solid ${theme.palette.divider}`,
    backgroundColor: lighten(indigo[100], 0.7),
  },
}));

export const TableTextField = styled(TextField)(({ theme }) => ({
  [`& .${inputBaseClasses.input}`]: {
    paddingTop: '4px',
    paddingBottom: '4px',
  },
}));

export const TotalsTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
}));
