import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { useGetCurrentUserQuery } from '../../client/graphql/getCurrentUser.generated';
import { useUpdateUserMutation } from '../../client/graphql/updateUser.generated';

export default function Settings() {
  const [{ data, fetching, error }] = useGetCurrentUserQuery();
  const router = useRouter();
  const [, updateUser] = useUpdateUserMutation();
  const [name, setName] = useState<string>('');
  const currentUser = data?.currentUser;

  // Once we load the current user, default the name input to their name
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

  return (
    <>
      <h1>{currentUser.name} Settings</h1>
      <input value={name} placeholder="Arnold Schwarzenegger" onChange={(evt) => setName(evt.target.value)} />
      <button
        disabled={!name}
        onClick={() => {
          if (!name) return;
          toast.promise(
            updateUser({
              name,
              userId: currentUser.id,
            }),
            {
              loading: `Updating settings...`,
              success: `Settings updated!`,
              error: (err) => err,
            }
          );
        }}
      >
        Save
      </button>
      <br />
      <Link href="/app">Back to dashboard</Link>
    </>
  );
}
