import React from 'react';

import { Header } from '../Header';

interface IPageProps {
  children?: any;
}

export const Page: React.SFC<IPageProps> = ({ children }) => (
  <div>
    <Header />
    {children}
  </div>
);
