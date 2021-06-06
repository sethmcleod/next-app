import { enumType, extendType, nonNull, objectType, stringArg } from 'nexus';
import slug from 'slug';

import prisma from '../../db/prisma';
import { getProjectPaidPlan } from '../../get-project-paid-plan';
import { generateInvitationToken } from '../../invitations/token';
import { sendEmail } from '../../send-email';
import stripe from '../../stripe';
import { plans } from '../../stripe/plans';

export const PaidPlan = enumType({
  name: `PaidPlan`,
  members: Object.keys(plans),
});

const Project = objectType({
  name: 'Project',
  definition(t) {
    t.model.id();
    t.model.users();
    t.model.name();
    t.model.slug();

    t.nullable.field('paidPlan', {
      type: `PaidPlan`,
      resolve: async ({ id }, _, ctx) => {
        if (!ctx.user?.id) return null;

        // This makes sure the user has access to the project
        const project = await prisma.project.findFirst({
          where: {
            users: {
              some: {
                id: ctx.user.id,
              },
            },
            id,
          },
        });

        return getProjectPaidPlan(project);
      },
    });
  },
});

const queries = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('project', {
      type: 'Project',
      args: {
        id: stringArg(),
        slug: stringArg(),
      },
      resolve: async (_, { id, slug }, ctx) => {
        if (!ctx.user?.id) return null;
        if ((!id && !slug) || (id && slug))
          throw new Error('Please provide either an ID or a slug to the project query');

        const project = await prisma.project.findFirst({
          where: {
            users: {
              some: {
                id: ctx.user.id,
              },
            },
            // Note: TypeScript doesn't understand that one is for sure defined here
            id: id as string,
            slug: slug as string,
          },
        });

        if (!project) return null;

        return project;
      },
    });
  },
});

const mutations = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.nullable.field('createProject', {
      type: 'Project',
      args: {
        name: nonNull(stringArg()),
        slug: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        if (!ctx.user?.id) return null;

        return await prisma.project.create({
          data: {
            name: args.name,
            slug: args.slug || slug(args.name),
            users: {
              connect: {
                id: ctx.user.id,
              },
            },
          },
        });
      },
    });

    t.nullable.field('createStripeCheckoutBillingPortalUrl', {
      type: 'String',
      args: {
        projectId: nonNull(stringArg()),
      },
      resolve: async (_, { projectId }, ctx) => {
        if (!ctx.user?.id) return null;

        const project = await prisma.project.findFirst({
          where: {
            users: {
              some: {
                id: ctx.user.id,
              },
            },
            id: projectId,
          },
        });

        if (!project || !project.stripeCustomerId) return null;

        const { url } = await stripe.billingPortal.sessions.create({
          customer: project.stripeCustomerId,
          return_url: `${ctx.origin}/app/${project.slug}/settings`,
        });

        return url;
      },
    });

    t.nullable.field('createStripeCheckoutSession', {
      type: 'String',
      args: {
        plan: nonNull('PaidPlan'),
        projectId: nonNull(stringArg()),
      },
      resolve: async (_, { projectId, plan }, ctx) => {
        if (!ctx.user?.id) return null;

        const priceId = plans[plan];

        if (!priceId) return null;

        const project = await prisma.project.findFirst({
          where: {
            users: {
              some: {
                id: ctx.user.id,
              },
            },
            id: projectId,
          },
        });

        if (!project) return null;

        // checkout.sessions.create can only be called with *either* a customer ID (if it exists) *or* a customer_email (if no ID exists yet)
        const customerMetadata = project.stripeCustomerId
          ? {
              customer: project.stripeCustomerId,
            }
          : {
              customer_email: ctx.user.email,
            };

        const session = await stripe.checkout.sessions.create({
          mode: 'subscription',
          payment_method_types: ['card'],
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          metadata: {
            projectId,
            userId: ctx.user.id,
          },
          allow_promotion_codes: true,
          ...customerMetadata,
          billing_address_collection: 'auto',
          success_url: `${ctx.origin}/app/${project.slug}/?upgraded=true`,
          cancel_url: `${ctx.origin}/app/${project.slug}`,
        });

        return session.id;
      },
    });

    t.nullable.field('inviteToProject', {
      type: 'Boolean',
      args: {
        projectId: nonNull(stringArg()),
        email: nonNull(stringArg()),
      },
      resolve: async (_, { projectId, email }, ctx) => {
        if (!ctx.user?.id) return null;

        const inviter = await prisma.user.findUnique({
          where: {
            id: ctx.user.id,
          },
        });

        const project = await prisma.project.findFirst({
          where: {
            users: {
              some: {
                id: ctx.user.id,
              },
            },
            id: projectId,
          },
        });

        if (!project || !inviter) return null;

        const token = generateInvitationToken({
          destination: email,
          projectId,
        });

        await sendEmail({
          to: email,
          subject: `${inviter.name || inviter.email} invited you`,
          text: `Hey! Click on this link to accept your invite: ${ctx.origin}/api/invitations/accept/?token=${token}`,
        });

        return true;
      },
    });

    t.nullable.field('removeUserFromProject', {
      type: 'Project',
      args: {
        projectId: nonNull(stringArg()),
        userId: nonNull(stringArg()),
      },
      resolve: async (_, { projectId, userId }, ctx) => {
        if (!ctx.user?.id) return null;

        const hasAccess = await prisma.project.findFirst({
          where: {
            users: {
              some: {
                id: ctx.user.id,
              },
            },
            id: projectId,
          },
        });

        if (!hasAccess) return null;

        const project = await prisma.project.update({
          where: {
            id: projectId,
          },
          data: {
            users: {
              disconnect: {
                id: userId,
              },
            },
          },
        });

        return project;
      },
    });
  },
});

export default [Project, mutations, queries];
