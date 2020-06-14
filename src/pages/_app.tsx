import { CSSReset, ThemeProvider } from '@chakra-ui/core';
import { NextComponentType } from 'next';
import React from 'react';

const App = ({ Component, pageProps }: { Component: NextComponentType; pageProps: any }) => {
  return (
    <ThemeProvider>
      <CSSReset />
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default App;
