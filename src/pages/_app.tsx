import { ColorModeProvider, CSSReset, ThemeProvider } from '@chakra-ui/core';
import { NextComponentType } from 'next';
import React from 'react';

const App = ({ Component, pageProps }: { Component: NextComponentType; pageProps: any }) => {
  return (
    <ThemeProvider>
      <CSSReset />
      <ColorModeProvider>
        <Component {...pageProps} />
      </ColorModeProvider>
    </ThemeProvider>
  );
};

export default App;
