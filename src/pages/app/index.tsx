import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useMutation } from 'urql';

import { CreateProjectDocument } from '../../client/graphql/createProject.generated';
import { useGetCurrentUserQuery } from '../../client/graphql/getCurrentUser.generated';

export default function Dashboard() {
  const router = useRouter();
  const [{ data, fetching, error }] = useGetCurrentUserQuery();
  const [, createProject] = useMutation(CreateProjectDocument);
  const [name, setName] = useState('');

  if (fetching) return <p>Loading...</p>;

  if (error) return <p>{error.message}</p>;

  if (!data?.currentUser) {
    if (process.browser) router.push('/login');
    return (
      <p>
        Redirecting to <Link href="/login">/login</Link>
        ...
      </p>
    );
  }

  return (
    <>
      <h1>Hello {data.currentUser.name}!</h1>
      <ul>
        {data.currentUser.projects.map((project) => (
          <li key={project.slug}>
            <Link href={`/app/${project.slug}`}>{project.name}</Link>
          </li>
        ))}
      </ul>
      <input placeholder="Hooli Inc." value={name} onChange={(evt) => setName(evt.target.value)} />
      <button
        disabled={!name}
        onClick={() => {
          createProject({
            name,
          }).then((result) => {
            const slug = result.data?.createProject?.slug;
            if (slug) router.push(`/app/${slug}`);
          });
        }}
      >
        Create project
      </button>
      <br />
      <Link href="/app/settings">Settings</Link>
      <br />
      <Link href="/api/auth/logout">Logout</Link>
    </>
  );
}
