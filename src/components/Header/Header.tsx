import { Flex, Heading } from '@chakra-ui/core';
import React from 'react';

export const Header: React.SFC = (props) => {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1.5rem"
      bg="gray.700"
      color="white"
      {...props}
    >
      <Flex align="center" mr={5}>
        <Heading as="h1" size="lg">
          Web App
        </Heading>
      </Flex>
    </Flex>
  );
};
