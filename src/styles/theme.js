import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    primary: {
      main: 'rgb(4, 125, 149)',
    },
    secondary: {
      main: '#ff9800',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
    action: {
      hover: 'rgba(0, 0, 0, 0.04)',
    },
  },
});

const darkTheme = createTheme({
  palette: {
    primary: {
      main: 'rgb(4, 125, 149)',
    },
    secondary: {
      main: '#ff9800',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
    },
    action: {
      hover: 'rgba(255, 255, 255, 0.04)',
    },
  },
});

export { lightTheme, darkTheme };
