import { NextComponentType } from 'next';
import React from 'react';

// tslint:disable ordered-imports
import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '../styles.scss';

const App = ({ Component, pageProps }: { Component: NextComponentType; pageProps: any }) => {
  return (
    <div className="root">
      <Component {...pageProps} />
    </div>
  );
};

export default App;
