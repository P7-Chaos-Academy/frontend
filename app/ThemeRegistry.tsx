'use client';

import * as React from 'react';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createCache from '@emotion/cache';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '@/lib/theme';

type Props = {
  children: React.ReactNode;
};

// Client-side cache for Emotion so that the generated class names are consistent
const createEmotionCache = () => {
  return createCache({ key: 'mui', prepend: true });
};

export default function ThemeRegistry({ children }: Props) {
  const [cache] = React.useState<EmotionCache>(() => createEmotionCache());

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
