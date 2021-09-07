import { ButtonGroup, ButtonGroupProps, IconButton } from '@chakra-ui/button';
import { Box, Stack, Text } from '@chakra-ui/layout';
import { FaGithub, FaTwitter } from 'react-icons/fa';

const SocialMediaLinks = (props: ButtonGroupProps) => (
  <ButtonGroup variant="ghost" color="gray.600" {...props}>
    <IconButton as="a" href="#" aria-label="GitHub" icon={<FaGithub fontSize="20px" />} />
    <IconButton as="a" href="#" aria-label="Twitter" icon={<FaTwitter fontSize="20px" />} />
  </ButtonGroup>
);

export default function Footer() {
  return (
    <Box as="footer" role="contentinfo" mx="auto" maxW="7xl" py="12" px={{ base: '4', md: '8' }}>
      <Stack direction="row" spacing="4" align="center" justify="space-between">
        <Text>&copy; {new Date().getFullYear()} Next App</Text>
        <SocialMediaLinks />
      </Stack>
    </Box>
  );
}
