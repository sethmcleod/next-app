import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';

import UpgradeButton from '../../../client/components/UpgradeButton';
import { useCreateStripeCheckoutBillingPortalUrlMutation } from '../../../client/graphql/createStripeCheckoutBillingPortalUrl.generated';
import { useGetCurrentUserQuery } from '../../../client/graphql/getCurrentUser.generated';
import { useGetProjectQuery } from '../../../client/graphql/getProject.generated';
import { useInviteToProjectMutation } from '../../../client/graphql/inviteToProject.generated';
import { useRemoveUserFromProjectMutation } from '../../../client/graphql/removeUserFromProject.generated';

function InvitationForm({ projectId }: { projectId: string }) {
  const [email, setEmail] = useState('');
  const [, inviteToProject] = useInviteToProjectMutation();

  return (
    <form
      onSubmit={(evt) => {
        evt.preventDefault();
        toast
          .promise(
            inviteToProject({
              projectId,
              email,
            }),
            {
              loading: `Inviting ${email}...`,
              success: `Invited ${email}!`,
              error: (err) => err,
            }
          )
          .then(() => {
            setEmail('');
          });
      }}
    >
      <input
        type="email"
        placeholder="colleague@company.com"
        value={email}
        onChange={(evt) => setEmail(evt.target.value)}
      />
      <button type="submit" disabled={email.length === 0}>
        Invite
      </button>
    </form>
  );
}

function ProjectSettings() {
  const router = useRouter();
  const { slug } = router.query;
  const [{ data: currentUserData }] = useGetCurrentUserQuery();
  const [{ data, fetching, error }] = useGetProjectQuery({
    variables: {
      slug: String(slug),
    },
  });
  const [, createStripeCheckoutBillingPortalUrl] = useCreateStripeCheckoutBillingPortalUrlMutation();

  const [, removeUserFromProject] = useRemoveUserFromProjectMutation();

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  if (!data?.project || typeof slug !== 'string') return <p>Not found.</p>;
  if (!currentUserData?.currentUser) return null;

  const { currentUser } = currentUserData;
  const { project } = data;

  return (
    <>
      <h1>{project.name} Settings</h1>
      <h2>Users</h2>
      <ul>
        {project.users.map((user) => (
          <li key={user.id}>
            {user.name || user.email}{' '}
            {user.id !== currentUser.id && (
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      `Are you sure you want to remove ${user.email} from ${project.name || 'this project'}?`
                    )
                  ) {
                    toast.promise(
                      removeUserFromProject({
                        projectId: project.id,
                        userId: user.id,
                      }),
                      {
                        loading: `Removing ${user.email}...`,
                        success: `Removed ${user.email}!`,
                        error: (err) => err,
                      }
                    );
                  }
                }}
              >
                ｘ
              </button>
            )}
          </li>
        ))}
      </ul>
      <InvitationForm projectId={project.id} />
      {!project.paidPlan ? (
        <UpgradeButton projectId={project.id} />
      ) : (
        <button
          onClick={() => {
            createStripeCheckoutBillingPortalUrl({
              projectId: project.id,
            }).then((result) => {
              const url = result.data?.createStripeCheckoutBillingPortalUrl;
              if (url) window.location.href = url;
            });
          }}
        >
          Manage billing
        </button>
      )}
      <br />
      <Link href={`/app/${project.slug}`}>Back to project dashboard</Link>
    </>
  );
}

export default ProjectSettings;
