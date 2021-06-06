import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'urql';

import Layout from '../client/components/Layout';
import { client } from '../client/graphql/client';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <Layout>
        <Component {...pageProps} />
        <Toaster />
      </Layout>
    </Provider>
  );
}

export default CustomApp;
