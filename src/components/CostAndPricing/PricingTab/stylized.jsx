// @ts-check
import {
  Fab,
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
    // borderRight: `1px solid ${indigo.indigo7}`,
    borderBottom: `1px solid ${indigo.indigo5}`,
    backgroundColor: indigo.indigo3,
  },
  [`& > .${tableCellClasses.head}:first-child`]: {
    borderRight: `1px solid ${indigo.indigo7}`,
  },
  // [`&:last-child > .${tableCellClasses.head}`]: {
  //   borderBottomWidth: 0,
  // },
  // // Adds a border to the right of all the body cells except the last three.
  // [`& > .${tableCellClasses.body}:not(:nth-last-child(-n + 3))`]: {
  //   borderRight: `1px solid ${jade.jade7}`,
  // },
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

export const PricingTableFab = styled(Fab)(({ theme }) => ({
  color: 'white', // Radix says indigo9 & indigo10 pair with white
  backgroundColor: indigo.indigo9,
  '&:hover': {
    backgroundColor: indigo.indigo10,
    // Reset on touch devices, it doesn't add specificity
    '@media (hover: none)': {
      backgroundColor: indigo.indigo9,
    },
  },
}));
