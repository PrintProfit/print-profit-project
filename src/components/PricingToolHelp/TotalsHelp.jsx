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
              <p>
                This table is simply an extension of the main pricing tool
                table. However, This table provides the benefit of having the
                first column costs close together with the total values, and the
                added feature to experiment with different values of
                contribution %, and Total selling price.
                <br />
                <br />
                This table allows you to see the effect that a specific
                contribution %, or a manually input total selling price has on
                the total profit.
                <br />
                These rows have been highlighted green to indicate importance.
              </p>
            </Typography>
          </Paper>
        </Fade>
      </Modal>
    </>
  );
}
export default TotalsHelp;
