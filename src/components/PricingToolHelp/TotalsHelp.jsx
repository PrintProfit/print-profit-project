import { Help } from '@mui/icons-material';
import {
  Divider,
  Fade,
  IconButton,
  Modal,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
export function TotalsHelp() {
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
            <Typography variant="h6">Totals Help</Typography>
            <Divider />
            <Typography sx={{ mt: 2 }}>
              <>
                This table displays the total values from the pricing table. It
                also allows you to manually enter a target selling price or
                target profit margin %, or contribution %.
                <br />
                <br />
                This allows you to see the effect that a specific contribution %
                or a manually input total selling price has on the total profit.
                <br />
                The editable fields are outline in black and the rows containing
                them are highlighted in light green.
              </>
            </Typography>
          </Paper>
        </Fade>
      </Modal>
    </>
  );
}
export default TotalsHelp;
