import * as React from 'react';
import type { AppProps } from 'next/app';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import createEmotionCache from '../createEmotionCache';

// Create a client‑side cache for Emotion.  This will be used on the client to
// ensure that generated class names match those generated on the server.
const clientSideEmotionCache = createEmotionCache();

// Define the shape of props accepted by our custom App component.  It
// optionally receives an Emotion cache injected by _document.tsx.
interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

// Create a light theme using Material UI's default settings.  You can
// customize the palette and typography here to match your personal style.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
  },
});

export default function MyApp({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}: MyAppProps) {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}