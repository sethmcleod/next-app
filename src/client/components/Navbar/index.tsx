import Link from 'next/link';

import { useGetCurrentUserQuery } from '../../graphql/getCurrentUser.generated';

function Navbar() {
  const [{ data }] = useGetCurrentUserQuery();
  const isAuthenticated = !!data?.currentUser;

  return (
    <div style={{ display: `flex`, justifyContent: `space-between` }}>
      <Link href={isAuthenticated ? `/app` : `/`}>Next App</Link>
      {isAuthenticated && <Link href="/api/auth/logout">Logout</Link>}
    </div>
  );
}

export default Navbar;
