// Supports weights 200-900
import '@fontsource-variable/source-sans-3';
import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5CCD8B',
    },
    secondary: {
      main: '#FFC107',
    },
  },
  typography: {
    fontFamily: 'Source Sans Pro, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `@font-face{
          font-family: 'Source Sans Pro';
          font-style: normal;
          font-display: swap;
          font-weight: 100;
        }
      }
        `,
    },
  },
});

export default theme;
