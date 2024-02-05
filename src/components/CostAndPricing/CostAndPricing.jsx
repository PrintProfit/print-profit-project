// @ts-check
import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import HistoryTab from './HistoryTab/HistoryTab';
import { PricingTab } from './PricingTab';
import { emptyQuote } from './PricingTab/sample-data';

/**
 * Later on, this could be tweaked to use links for tabs, but right now that's
 * not being done.
 * The current implemtation is just based on mui's intro example.
 * @see {@link https://mui.com/material-ui/react-tabs/#introduction Tabs - Material UI}
 * @see {@link https://mui.com/material-ui/guides/routing/#tabs Routing Libraries - Material UI}
 */
export default function CostAndPricing() {
  const [value, setValue] = useState(0);

  const [quote, setQuote] = useState(emptyQuote);

  /**
   * @param {React.SyntheticEvent} event
   * @param {number} newValue
   */
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="Cost & Pricing tabs"
        >
          <Tab label="Pricing" {...a11yProps(0)} />
          <Tab label="History" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <PricingTab quote={quote} setQuote={setQuote} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <HistoryTab />
      </TabPanel>
    </Box>
  );
}

/**
 * @param {import('./prop-types').TabPanelProps} props
 */
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

/**
 * @param {number} index
 */
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
