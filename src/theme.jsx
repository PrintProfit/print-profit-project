// Supports weights 200-900
import '@fontsource-variable/source-sans-3';
import { createTheme } from '@mui/material';
import { green, purple } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: purple[500],
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
