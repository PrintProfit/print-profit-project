// @ts-check
import { TableRow, styled, tableCellClasses } from '@mui/material';

export const PricingTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
  [`& > .${tableCellClasses.head}`]: {
    // I really want to reduce the width of the head cells when they have
    // inputs in them, but I have no idea how to do that.
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));
