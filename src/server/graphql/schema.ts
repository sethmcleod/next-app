import { makeSchema } from 'nexus';
import { nexusPrisma } from 'nexus-plugin-prisma';
import path from 'path';

import User, { PaidPlan } from './User';

// Only generate in development or when the yarn run generate:nexus command is run
// This fixes deployment on Netlify, otherwise you'll run into an EROFS error during building
const shouldGenerateArtifacts = process.env.NODE_ENV === 'development' || !!process.env.GENERATE;

export const schema = makeSchema({
  types: [User, PaidPlan],
  plugins: [
    nexusPrisma({
      shouldGenerateArtifacts,
    }),
  ],
  // Type the GraphQL context when used in Nexus resolvers
  contextType: {
    module: path.join(process.cwd(), 'src/pages/api/index.ts'),
    export: 'GraphQLContext',
  },
  // Generate the files
  shouldGenerateArtifacts,
  outputs: {
    typegen: path.join(process.cwd(), 'src/server/graphql/nexus-types.generated.ts'),
    schema: path.join(process.cwd(), 'src/server/graphql/schema.graphql'),
  },
});
