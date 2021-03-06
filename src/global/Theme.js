import React from 'react';
import { ThemeProvider } from 'styled-components';
import { createTheme, ThemeProvider as ThemeProviderMUI } from '@mui/material/styles';

export const customTheme = {
  colors: {
    error: '#B00020',
    errorBackground: '#FAF0F2',
    success: '#2E7D32',
    successBackground: '#F2F7F3',
    alert: '#DC7700',
    alertBackground: '#FDF7F0',
    white: '#FFFFFF',
    black: '#000000',
    black87: 'rgba(0, 0, 0, 0.87)',
    black60: 'rgba(0, 0, 0, 0.6)',
    black34: 'rgba(0, 0, 0, 0.34)',
    black12: 'rgba(0, 0, 0, 0.12)',
  },
  breakPoints: {
    xSmall: '600px',
    small: '840px',
    medium: '1280px',
    large: '1360px',
  },
};

const materialUITheme = createTheme({
  palette: {
    primary: {
      light: '#E8DDCF',
      main: '#BB6341',
      dark: '#993B27',
      contrastText: '#fff',
    },
    secondary: {
      light: '#D3D2C6',
      main: '#485D66',
      dark: '#000000',
      contrastText: '#000000',
    },
  },
});

const Theme = ({ children }) => {
  return (
    <ThemeProvider theme={{ ...customTheme, ...materialUITheme }}>
      <ThemeProviderMUI theme={materialUITheme}>{children}</ThemeProviderMUI>
    </ThemeProvider>
  );
};

export const { breakPoints, colors, layers } = customTheme;

export default Theme;
