import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'urql';

import Layout from '../client/components/Layout';
import { client } from '../client/graphql/client';
import theme from '../client/theme';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <ChakraProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
          <Toaster />
        </Layout>
      </ChakraProvider>
    </Provider>
  );
}
