import { useColorModeValue } from '@chakra-ui/color-mode';
import { Box } from '@chakra-ui/layout';

import Footer from '../Footer';
import Header from '../Header';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <Box h="100%" bg={useColorModeValue('gray.50', 'inherit')}>
      <Header />
      <Box as="main" mx="auto" maxW="7xl" py="4" px={{ base: '4', md: '8' }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
