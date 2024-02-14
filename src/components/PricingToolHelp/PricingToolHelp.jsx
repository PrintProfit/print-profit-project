import { Help } from '@mui/icons-material';
import {
  Box,
  Divider,
  Fade,
  IconButton,
  Modal,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';

export function PricingToolHelp() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip title="Help">
        <IconButton aria-label="Help" onClick={() => setOpen(true)}>
          <Help />
        </IconButton>
      </Tooltip>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Fade in={open}>
          <Paper
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              minWidth: 300,
              p: 4,
            }}
          >
            <Typography variant="h4">Pricing Tool Help</Typography>
            <Divider />
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">Items</Typography>
              <>
                the left-hand side table, named "Pricing Tool," is a table for a
                singular transaction, or "quote." A single quote might have
                multiple items, such as T-shirts, hats etc. These items are
                displayed on the first row. The editable values have input
                fields, and are colored green for clarity.
                <br />
                <br />
                These items can be renamed, removed from the current quote, and
                saved as apart of the whole quote with the "Save as New Quote"
                button. You can also add a new item by clicking the green
                button, which is located to the right of the item columnns.
                <br />
                <br />
                <Typography variant="h6">Costs</Typography>
                The first column on the Pricing Tool table are all the values
                that you will want to know about an item, or about working with
                an item. This includes the name of the item, the selling price,
                and even the estimated hours that a given item might take to
                produce. This column is colored blue for organization and
                clarity.
                <br />
                <br />
                You can add a new row to this column by clicking the blue button
                labeled "Add Cost," which is located near the middle of the
                first column.
                <br />
                <br />
                <Typography variant="h6">Tips</Typography>
                <ul>
                  <li>
                    Easily find the fields that you can delete by locating the
                    garbage can icon in the right-hand side of the field
                  </li>
                  <li>
                    Some fields contain automatically generated values, which is
                    indicated by a math-like icon in the right-hand side of the
                    field
                  </li>
                  <li>
                    Fields with automatically generated values can be edited at
                    any time
                  </li>
                  <li>
                    rows or values that are not editable are indicated by a
                    white or gray color, and also do not have outlined text
                    fields
                  </li>
                  <li>
                    Take some time to add some different values to see how the
                    tool works!
                  </li>
                </ul>
              </>
            </Box>
          </Paper>
        </Fade>
      </Modal>
    </>
  );
}

export default PricingToolHelp;
