import { enumType, extendType, nonNull, objectType, stringArg } from 'nexus';
import slug from 'slug';

import prisma from '../../db/prisma';
import { getUserPaidPlan } from '../../get-user-paid-plan';
import { generateInvitationToken } from '../../invitations/token';
import { sendEmail } from '../../send-email';
import stripe from '../../stripe';
import { plans } from '../../stripe/plans';

export const PaidPlan = enumType({
  name: `PaidPlan`,
  members: Object.keys(plans),
});

const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.email();

    t.nullable.field('paidPlan', {
      type: 'PaidPlan',
      resolve: async (_, __, ctx) => {
        if (!ctx.user?.id) return null;

        return getUserPaidPlan(
          await prisma.user.findUnique({
            where: {
              id: ctx.user.id,
            },
          })
        );
      },
    });
  },
});

const queries = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('currentUser', {
      type: 'User',
      resolve: (_, __, ctx) => {
        if (!ctx.user?.id) return null;

        return prisma.user.findUnique({
          where: {
            id: ctx.user.id,
          },
        });
      },
    });
  },
});

const mutations = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.nullable.field('updateUser', {
      type: 'User',
      args: {
        userId: nonNull(stringArg()),
        name: stringArg(),
      },
      resolve: async (_, { userId, name }, ctx) => {
        if (!ctx.user?.id || userId !== ctx.user.id) return null;

        return await prisma.user.update({
          where: { id: userId },
          data: { name },
        });
      },
    });

    t.nullable.field('createStripeCheckoutBillingPortalUrl', {
      type: 'String',
      args: {
        userId: nonNull(stringArg()),
      },
      resolve: async (_, __, ctx) => {
        if (!ctx.user?.id) return null;

        const user = await prisma.user.findUnique({
          where: {
            id: ctx.user.id,
          },
        });

        if (!user || !user.stripeCustomerId) return null;

        const { url } = await stripe.billingPortal.sessions.create({
          customer: user.stripeCustomerId,
          return_url: `${ctx.origin}/app/settings`,
        });

        return url;
      },
    });

    t.nullable.field('createStripeCheckoutSession', {
      type: 'String',
      args: {
        plan: nonNull('PaidPlan'),
      },
      resolve: async (_, { plan }, ctx) => {
        if (!ctx.user?.id) return null;

        const priceId = plans[plan];

        if (!priceId) return null;

        const user = await prisma.user.findUnique({
          where: {
            id: ctx.user.id,
          },
        });

        if (!user) return null;

        // checkout.sessions.create can only be called with *either* a customer ID (if it exists) *or* a customer_email (if no ID exists yet)
        const customerMetadata = user.stripeCustomerId
          ? {
              customer: user.stripeCustomerId,
            }
          : {
              customer_email: user.email,
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
            userId: user.id,
          },
          allow_promotion_codes: true,
          ...customerMetadata,
          billing_address_collection: 'auto',
          success_url: `${ctx.origin}/app/?upgraded=true`,
          cancel_url: `${ctx.origin}/app`,
        });

        return session.id;
      },
    });
  },
});

export default [User, mutations, queries];
