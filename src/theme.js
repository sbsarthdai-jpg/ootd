import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0A0A0A' },
    secondary: { main: '#FF5D26' },
    background: { default: '#FFFFFF', paper: '#F5F5F3' },
    text: { primary: '#0A0A0A', secondary: '#6B6B6B' },
  },
  typography: {
    fontFamily: '"Montserrat", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.0 },
    h2: { fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.05 },
    h3: { fontWeight: 700, letterSpacing: '-0.01em' },
    body1: { fontWeight: 300, fontSize: '0.9rem', letterSpacing: '0.01em' },
    overline: { fontWeight: 500, fontSize: '0.65rem', letterSpacing: '0.18em' },
  },
  spacing: 8,
  shape: { borderRadius: 0 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 0, textTransform: 'none', fontFamily: '"Montserrat", sans-serif', fontWeight: 600 },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '&::-webkit-scrollbar': { width: '2px' },
          '&::-webkit-scrollbar-thumb': { background: '#0A0A0A' },
        },
      },
    },
  },
});

export default theme;
