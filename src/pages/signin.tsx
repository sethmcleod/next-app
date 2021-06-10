import { useColorModeValue } from '@chakra-ui/color-mode';
import { Box, Heading, Text } from '@chakra-ui/layout';

import AuthForm from '../client/components/AuthForm';

export default function Signin() {
  return (
    <Box maxW="md" mx="auto">
      <Heading textAlign="center" size="xl" fontWeight="extrabold">
        Sign in to your account
      </Heading>
      <Text mt="4" mb="8" align="center" maxW="md" fontWeight="medium">
        <Text as="span">We’ll email you a magic code for a password-free sign in ✨</Text>
      </Text>
      <Box
        bg={useColorModeValue('white', 'gray.700')}
        py="8"
        px={{ base: '4', md: '10' }}
        shadow="base"
        rounded={{ sm: 'lg' }}
      >
        <AuthForm />
      </Box>
    </Box>
  );
}
