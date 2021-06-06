import Link from 'next/link';
import { useRouter } from 'next/router';

import UpgradeButton from '../../../client/components/UpgradeButton';
import { useGetProjectQuery } from '../../../client/graphql/getProject.generated';

function Project() {
  const router = useRouter();
  const { slug } = router.query;
  const [{ data, fetching, error }] = useGetProjectQuery({
    variables: {
      slug: String(slug),
    },
  });

  if (fetching) return <p>Loading...</p>;

  if (error) return <p>{error.message}</p>;

  if (!data?.project || typeof slug !== 'string') return <p>Not found.</p>;

  const { project } = data;

  return (
    <>
      <h1>{project.name}</h1>
      {!project.paidPlan && <UpgradeButton projectId={project.id} />}
      <br />
      <Link href={`/app/${project.slug}/settings`}>Settings</Link>
    </>
  );
}

export default Project;
