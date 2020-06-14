import { Badge, Flex, Heading } from '@chakra-ui/core';
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
      {...props}
    >
      <Flex align="center" justify="space-between" width="100%" mr={5}>
        <Heading as="h1" size="lg" color="white">
          Next App
        </Heading>
        <Badge variantColor="gray">
          Alpha
        </Badge>
      </Flex>
    </Flex>
  );
};
