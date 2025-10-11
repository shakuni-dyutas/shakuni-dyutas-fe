'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';
import type { PropsWithChildren } from 'react';

interface ThemeProviderProps extends PropsWithChildren {
  attribute?: 'class' | 'data-theme';
}

function ThemeProvider({ children, attribute = 'class' }: ThemeProviderProps) {
  return (
    <NextThemeProvider
      attribute={attribute}
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
}

export { ThemeProvider };
