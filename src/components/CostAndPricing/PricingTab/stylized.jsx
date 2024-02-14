// @ts-check
import {
  Fab,
  TableRow,
  TextField,
  inputBaseClasses,
  styled,
  tableCellClasses,
} from '@mui/material';
import { gray, indigo, jade, jadeA } from '@radix-ui/colors';

export const PricingTableRow = styled(TableRow)({
  '&:nth-of-type(even)': {
    backgroundColor: gray.gray2,
    '&:has(input)': {
      backgroundColor: jade.jade3,
    },
  },
  '&:has(input)': {
    backgroundColor: jade.jade2,
  },
  [`& > .${tableCellClasses.head}`]: {
    // I really want to reduce the width of the head cells when they have
    // inputs in them, but I have no idea how to do that.
    // borderRight: `1px solid ${indigo.indigo7}`,
    borderBottom: `1px solid ${indigo.indigo5}`,
    backgroundColor: indigo.indigo3,
    fontWeight: 600,
  },
  [`& > .${tableCellClasses.head}:first-of-type`]: {
    borderRight: `1px solid ${indigo.indigo7}`,
  },
  // Remove top & bottom borders from first & last rows
  '&:first-of-type > td': {
    borderTopWidth: 0,
  },
  '&:last-of-type > td': {
    borderBottomWidth: 0,
  },
  // Boost font weight for footer cells
  [`& > .${tableCellClasses.footer}`]: {
    fontWeight: 500,
  },
});

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

export const PricingTableFab = styled(Fab)({
  color: 'white', // Radix says indigo9 & indigo10 pair with white
  backgroundColor: indigo.indigo9,
  '&:hover': {
    backgroundColor: indigo.indigo10,
    // Reset on touch devices, it doesn't add specificity
    '@media (hover: none)': {
      backgroundColor: indigo.indigo9,
    },
  },
});
