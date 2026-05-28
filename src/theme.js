import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0D0D0D' },
    secondary: { main: '#C8B89A' },
    background: {
      default: '#FAFAF8',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0D0D0D',
      secondary: '#6B6B6B',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", "Arial", sans-serif',
    h1: {
      fontFamily: '"Cormorant Garamond", serif',
      fontWeight: 300,
      letterSpacing: '-0.02em',
      lineHeight: 1.05,
    },
    h2: {
      fontFamily: '"Cormorant Garamond", serif',
      fontWeight: 400,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: '"Cormorant Garamond", serif',
      fontWeight: 400,
    },
    body1: {
      fontSize: '0.875rem',
      fontWeight: 300,
      letterSpacing: '0.02em',
    },
    overline: {
      fontSize: '0.65rem',
      letterSpacing: '0.2em',
      fontWeight: 400,
    },
  },
  spacing: 8,
  shape: { borderRadius: 0 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: 'none',
          letterSpacing: '0.1em',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': { width: '2px' },
          '&::-webkit-scrollbar-thumb': { background: '#0D0D0D' },
        },
      },
    },
  },
});

export default theme;
