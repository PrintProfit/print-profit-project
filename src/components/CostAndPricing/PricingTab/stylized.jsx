// @ts-check
import {
  TableRow,
  TextField,
  inputBaseClasses,
  styled,
  tableCellClasses,
} from '@mui/material';
import { indigo, jade, jadeA } from '@radix-ui/colors';

export const PricingTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:has(input)': {
    backgroundColor: jade.jade3,
  },
  '&:nth-of-type(even):has(input)': {
    backgroundColor: jade.jade2,
  },
  [`& > .${tableCellClasses.head}`]: {
    // I really want to reduce the width of the head cells when they have
    // inputs in them, but I have no idea how to do that.
    borderRight: `1px solid ${theme.palette.divider}`,
    backgroundColor: indigo.indigo3,
  },
}));

export const TableTextField = styled(TextField)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create([
    'border-color',
    'background-color',
    'box-shadow',
  ]),
  '&.Mui-focused': {
    borderColor: jade.jade8,
    boxShadow: `${jadeA.jadeA8} 0 0 0 2px`,
  },
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
