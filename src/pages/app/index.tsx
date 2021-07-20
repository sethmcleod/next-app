import { Box, Heading } from '@chakra-ui/layout';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useGetCurrentUserQuery } from '../../client/graphql/getCurrentUser.generated';

export default function Dashboard() {
  const router = useRouter();
  const [{ data, fetching, error }] = useGetCurrentUserQuery();
  const username = data?.currentUser?.name ? ` ${data.currentUser.name}` : '';

  if (fetching) return <p>Loading...</p>;

  if (error) return <p>{error.message}</p>;

  if (!data?.currentUser) {
    if (process.browser) router.push('/signin');
    return (
      <p>
        Redirecting to <Link href="/signin">/signin</Link>
        ...
      </p>
    );
  }

  return (
    <Box align="center" maxW="md" mx="auto">
      <Heading size="xl" fontWeight="extrabold">
        Hello{username}!
      </Heading>
      <Box mt="4" mb="8" maxW="md" fontWeight="medium">
        <Link href="/app/settings">Settings</Link>
        <br />
        <Link href="/api/auth/logout">Sign out</Link>
      </Box>
    </Box>
  );
}
