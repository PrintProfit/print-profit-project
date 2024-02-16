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
              <Typography>
                The left-hand side table, named "Pricing Tool," is a table for a
                singular order, or "quote." A single quote might have multiple
                products, such as T-shirts, hats etc. These product names are
                displayed on the first row. The fields that the user can edit
                are outlined in black boxes, which will turn green when you
                click on them.
                <br />
                <br />
                Products can be renamed, removed from the current quote, and
                saved as a part of the whole quote with the "Save as New Quote"
                button. You can also add a new product by clicking the green
                "+"" button, which is located to the right of the product
                columnns.
                <br />
                <br />
              </Typography>
              <Typography variant="h6">Costs</Typography>
              <Typography>
                The first column on the Pricing Tool table is all the
                costs/expenses that you will want to know about an product, or
                about working with an product. This includes the name of the
                product, the selling price, and even the estimated labor hours
                that a given product might take to produce. This column is
                colored blue for organization and clarity.
                <br />
                <br />
                You can add a new row to this column by clicking the blue button
                labeled "Add Cost +," which is located near the middle of the
                first column.
                <br />
                <br />
              </Typography>
              <Typography variant="h6">Tips</Typography>
              <Typography>
                <ul>
                  <li>
                    Easily find the fields that you can delete by locating the
                    garbage can icon in the right-hand side of the field.
                  </li>
                  <li>
                    Some fields contain automatically calculated values, which
                    is indicated by a math operator icon in the right-hand side
                    of the field.
                  </li>
                  <li>
                    Fields with automatically calculated values can also be
                    manually edited at any time. If you manually edit a field,
                    that will override the automatically calculated value.
                  </li>
                  <li>
                    Rows or fields that are not editable are indicated by a
                    white or gray color, and do not have outlined text fields.
                  </li>
                  <li>
                    Take some time to add some different numbers to see how the
                    tool works!
                  </li>
                </ul>
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Modal>
    </>
  );
}

export default PricingToolHelp;
