// @ts-check
import { Box } from '@mui/material';
import { PricingTab } from './PricingTab';

/**
 * Later on, this could be tweaked to use links for tabs, but right now that's
 * not being done.
 * @see {@link https://mui.com/material-ui/guides/routing/#tabs Routing Libraries - Material UI}
 */
export default function CostAndPricing() {
  return (
    <Box sx={{ padding: '3rem' }}>
      <PricingTab />
    </Box>
  );
}
