// @ts-check
import { TableRow, styled, tableCellClasses } from '@mui/material';

export const PricingTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
  [`& > .${tableCellClasses.head}`]: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));
