import { NextComponentType } from 'next';
import React from 'react';

const App = ({ Component, pageProps }: { Component: NextComponentType; pageProps: any }) => {
  return (
    <div className="root">
      <Component {...pageProps} />
    </div>
  );
};

export default App;
