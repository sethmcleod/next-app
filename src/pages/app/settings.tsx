import {
  Box,
  Button,
  chakra,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import UpgradeButton from '../../client/components/UpgradeButton';
import { useCreateStripeCheckoutBillingPortalUrlMutation } from '../../client/graphql/createStripeCheckoutBillingPortalUrl.generated';
import { useGetCurrentUserQuery } from '../../client/graphql/getCurrentUser.generated';
import { useUpdateUserMutation } from '../../client/graphql/updateUser.generated';

export default function Settings() {
  const [{ data, fetching, error }] = useGetCurrentUserQuery();
  const [, createStripeCheckoutBillingPortalUrl] = useCreateStripeCheckoutBillingPortalUrlMutation();
  const router = useRouter();
  const [, updateUser] = useUpdateUserMutation();
  const [name, setName] = useState<string>('');
  const currentUser = data?.currentUser;
  const username = data?.currentUser?.name || '';
  const bgColor = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    if (currentUser?.name) setName(currentUser.name);
  }, [currentUser]);

  if (fetching) return <p>Loading...</p>;

  if (error) return <p>{error.message}</p>;

  if (!currentUser) {
    if (process.browser) router.push('/signin');
    return (
      <p>
        Redirecting to <Link href="/signin">/signin</Link>
        ...
      </p>
    );
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.promise(
      updateUser({
        name,
        userId: currentUser.id,
      }),
      {
        loading: 'Updating settings...',
        success: 'Settings updated!',
        error: (err) => err,
      }
    );
  };

  return (
    <Box maxW="md" mx="auto">
      <Heading textAlign="center" size="xl" fontWeight="extrabold">
        Settings
      </Heading>
      <Text mt="4" mb="8" align="center" maxW="md" fontWeight="medium">
        {username && <Text as="p">{`Hey ${username}! 👋`}</Text>}
        <Text as="p">Here you can update your name or upgrade to Pro!</Text>
      </Text>
      <Box bg={bgColor} py="8" px={{ base: '4', md: '10' }} shadow="base" rounded={{ sm: 'lg' }}>
        <chakra.form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input type="text" placeholder="Steve Jobs" value={name} onChange={(evt) => setName(evt.target.value)} />
            <Button colorScheme="blue" w="100%" mt="3" type="submit">
              Save
            </Button>
          </FormControl>
        </chakra.form>
        <Flex align="center" color="gray.300" my="6">
          <Box flex="1">
            <Divider borderColor="currentcolor" />
          </Box>
          <Text as="p" px="3" color={useColorModeValue('gray.600', 'gray.400')} fontWeight="medium">
            or
          </Text>
          <Box flex="1">
            <Divider borderColor="currentcolor" />
          </Box>
        </Flex>
        {!currentUser.paidPlan ? (
          <UpgradeButton />
        ) : (
          <Button
            colorScheme="yellow"
            w="100%"
            onClick={() => {
              createStripeCheckoutBillingPortalUrl({
                userId: currentUser.id,
              }).then((result) => {
                const url = result.data?.createStripeCheckoutBillingPortalUrl;
                if (url) window.location.href = url;
              });
            }}
          >
            Manage billing
          </Button>
        )}
      </Box>
    </Box>
  );
}
