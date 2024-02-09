// Supports weights 200-900
import '@fontsource-variable/source-sans-3';
import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5CCD8B',
    },
    secondary: {
      main: '#3C2A80',
    },
    button: {
      main: '#3C2A80',
      contrastText: 'white',
    },
    warning: {
      main: '#FFC107',
    },
  },
  typography: {
    fontFamily: '"Source Sans 3 Variable", sans-serif',
  },
});

export default theme;
