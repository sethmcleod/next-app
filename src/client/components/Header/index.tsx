import { Button, ButtonGroup, IconButton } from '@chakra-ui/button';
import { useColorMode } from '@chakra-ui/color-mode';
import { Box, Flex } from '@chakra-ui/layout';
import Link from 'next/link';
import { IoMoon, IoSunny } from 'react-icons/io5';

import { useGetCurrentUserQuery } from '../../graphql/getCurrentUser.generated';
import Logo from '../Logo';

const ColorModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton
      aria-label="Toggle theme"
      icon={colorMode === 'light' ? <IoMoon /> : <IoSunny />}
      onClick={toggleColorMode}
    />
  );
};

export default function Header() {
  const [{ data }] = useGetCurrentUserQuery();
  const isAuthenticated = !!data?.currentUser;

  return (
    <Box as="header" mx="auto" maxW="7xl" py="4" px={{ base: '4', md: '8' }}>
      <Flex as="nav" align="center" justify="space-between">
        <Logo fontSize="2xl" fontWeight="bold" />
        <ButtonGroup variant="ghost" color="gray.600">
          <ColorModeToggle />
          {isAuthenticated ? (
            <Link href="/api/auth/logout">
              <Button>Sign out</Button>
            </Link>
          ) : (
            <Link href="/signin">
              <Button>Sign in</Button>
            </Link>
          )}
        </ButtonGroup>
      </Flex>
    </Box>
  );
}
