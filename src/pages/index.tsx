import { Button } from '@chakra-ui/button';
import { Box, Flex, Heading, Text } from '@chakra-ui/layout';
import Link from 'next/link';

import { useGetCurrentUserQuery } from '../client/graphql/getCurrentUser.generated';

export default function Home() {
  const [{ data }] = useGetCurrentUserQuery();

  return (
    <Flex align="center" direction="column" maxW="md" mx="auto">
      <Heading textAlign="center" size="xl" fontWeight="extrabold">
        Welcome home
      </Heading>
      <Box mt="4" mb="8" align="center" maxW="md" fontWeight="medium">
        <Text mb="1">This is a simple app to demo some basic functionality.</Text>
        <Text mb="1">Click the button below!</Text>
      </Box>
      {!data?.currentUser ? (
        <Link href="/signin">
          <Button colorScheme="blue" px="8">
            Sign in
          </Button>
        </Link>
      ) : (
        <Link href="/app">
          <Button colorScheme="blue" px="8">
            Go to dashboard
          </Button>
        </Link>
      )}
    </Flex>
  );

  return;
}
