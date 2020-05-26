import React from 'react';

interface IPageProps {
  children?: any;
}

export const Page: React.SFC<IPageProps> = ({ children }) => (
  <div>
    <div>Web App</div>
    {children}
  </div>
);
