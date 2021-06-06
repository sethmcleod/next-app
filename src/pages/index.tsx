import Link from 'next/link';

import { useGetCurrentUserQuery } from '../client/graphql/getCurrentUser.generated';

function Homepage() {
  const [{ data }] = useGetCurrentUserQuery();

  return (
    <>
      <h1>Next App</h1>
      {!data?.currentUser ? (
        <>
          <Link href="/get-started">Get started</Link>
          <br />
          <Link href="/login">Login</Link>
        </>
      ) : (
        <Link href="/app">Go to dashboard</Link>
      )}
    </>
  );
}

export default Homepage;
