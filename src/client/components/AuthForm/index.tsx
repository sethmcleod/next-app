import { Button, chakra, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const router = useRouter();
  const { r } = router.query;
  const redirect = r?.toString();
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // POST a request with the users email or phone number to the server
    fetch(`/api/auth/magiclink`, {
      method: `POST`,
      body: JSON.stringify({
        redirect,
        destination: email,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          // Add the email and security code to the query params so we can show them on the /check-mailbox page
          router.push(`/check-mailbox?e=${encodeURIComponent(email)}&c=${json.code}`);
        }
      });
  };

  return (
    <chakra.form onSubmit={handleSubmit}>
      <FormControl>
        <FormLabel>Email address</FormLabel>
        <Input type="email" placeholder="me@hello.com" value={email} onChange={(evt) => setEmail(evt.target.value)} />
        <Button colorScheme="blue" w="100%" mt="3" type="submit">
          Let's go!
        </Button>
      </FormControl>
    </chakra.form>
  );
}
