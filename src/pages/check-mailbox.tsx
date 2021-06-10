import { Box, Code, Heading, Text } from '@chakra-ui/layout';
import { useRouter } from 'next/router';

export default function CheckMailbox() {
  const router = useRouter();
  const email = router.query.e && decodeURIComponent(router.query.e.toString());
  const code = router.query.c && decodeURIComponent(router.query.c.toString());

  return (
    <Box align="center" maxW="md" mx="auto">
      <Heading size="xl" fontWeight="extrabold">
        Check your mailbox!
      </Heading>
      <Box mt="4" mb="8" maxW="md" fontWeight="medium">
        <Text mb="1">We've sent you a magic link to {email ? <Code>{email}</Code> : 'your email'}.</Text>
        <Text mb="1">Click on the link to finish signing in.</Text>
        {code && (
          <Text mb="1">
            Make sure the verification code matches <Code>{code}</Code>!
          </Text>
        )}
      </Box>
    </Box>
  );
}
