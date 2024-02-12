import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
export default function Header() {
  return (
    <AppBar color="secondary" position="static">
      <Toolbar>
        {/* Change font */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            pr: 10,
            width: '40%', // adjust as needed
          }}
        >
          <Button color="inherit">Something</Button>
        </Box>
        <Box sx={{ alignText: 'center' }}>
          <Typography variant="h3" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Print Profit
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '20%', // adjust as needed
          }}
        >
          <Button color="inherit">About</Button>
          <Button color="inherit">Contact</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
