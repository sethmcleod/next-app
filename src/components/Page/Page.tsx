import { Alignment, Button, Navbar, Tag } from '@blueprintjs/core';

interface IPageProps {
  children?: any;
}

export const Page: React.SFC<IPageProps> = ({ children }) => (
  <div className="bp3-dark">
    <Navbar>
      <Navbar.Group align={Alignment.LEFT}>
        <Navbar.Heading>Web App</Navbar.Heading>
        <Tag large={true} minimal={true}>Coming Soon</Tag>
      </Navbar.Group>
      <Navbar.Group align={Alignment.RIGHT}>
        <Button minimal={true} icon="cog" />
      </Navbar.Group>
    </Navbar>
    {children}
  </div>
);
