import { Flex, FlexProps, Text } from '@chakra-ui/layout';
import { chakra, HTMLChakraProps } from '@chakra-ui/system';
import { useRouter } from 'next/router';
import { MouseEventHandler } from 'react';

import { useGetCurrentUserQuery } from '../../graphql/getCurrentUser.generated';

// High Voltage emoji from https://twemoji.twitter.com/
const Emoji = (props: HTMLChakraProps<'svg'>) => {
  return (
    <chakra.svg viewBox="0 0 36 36" {...props}>
      <path
        fill="#FFAC33"
        d="M32.938 15.651C32.792 15.26 32.418 15 32 15H19.925L26.89 1.458c.219-.426.106-.947-.271-1.243C26.437.071 26.218 0 26 0c-.233 0-.466.082-.653.243L18 6.588 3.347 19.243c-.316.273-.43.714-.284 1.105S3.582 21 4 21h12.075L9.11 34.542c-.219.426-.106.947.271 1.243.182.144.401.215.619.215.233 0 .466-.082.653-.243L18 29.412l14.653-12.655c.317-.273.43-.714.285-1.106z"
      />
    </chakra.svg>
  );
};

export default function Logo(flexProps: FlexProps) {
  const router = useRouter();
  const [{ data }] = useGetCurrentUserQuery();
  const isAuthenticated = !!data?.currentUser;

  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    router.push(isAuthenticated ? '/app' : '/');
  };

  return (
    <Flex align="center" role="button" onClick={handleClick} {...flexProps}>
      <Emoji h="1em" w="1em" mr="0.25em" />
      <Text>Next App</Text>
    </Flex>
  );
}
