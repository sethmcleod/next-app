import { ApolloServer } from 'apollo-server-micro';

import handler from '../../server/api-route';
import prisma from '../../server/db/prisma';
import { getRequestOrigin } from '../../server/get-request-origin';
import { schema } from '../../server/graphql/schema';

export const config = {
  api: {
    bodyParser: false,
  },
};

export interface GraphQLContext {
  user?: Express.User;
  prisma: typeof prisma;
  origin: string;
}

export default handler().use(
  new ApolloServer({
    schema,
    context: ({ req }): GraphQLContext => ({
      user: req.user,
      origin: getRequestOrigin(req),
      prisma,
    }),
  }).createHandler({
    path: '/api',
  })
);
