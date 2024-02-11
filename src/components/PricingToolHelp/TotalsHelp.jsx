import { Help } from '@mui/icons-material';
import {
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
            <Typography sx={{ mt: 2 }}>TODO Totals</Typography>
          </Paper>
        </Fade>
      </Modal>
    </>
  );
}
export default TotalsHelp;
