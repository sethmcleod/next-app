import { User } from '@prisma/client';

import { plans } from './stripe/plans';

const MILLISECONDS_IN_A_DAY = 86_400_000;

type Plan = keyof typeof plans;
/**
 * @returns the user's paid plan or null if the user is a free one
 *
 * @example
 * ```ts
 * const user = await prisma.user.findFirst(...)
 * const plan = getUserPaidPlan(user)
 * ```
 */
export const getUserPaidPlan = (user: User | null): Plan | null => {
  if (
    !user ||
    !user.stripePriceId ||
    !user.stripeCurrentPeriodEnd ||
    // We give users a grace period of 24 hours to pay their invoices
    user.stripeCurrentPeriodEnd.getTime() + MILLISECONDS_IN_A_DAY < Date.now()
  )
    return null;

  const plan = Object.keys(plans).find((plan) => plans[plan as Plan] === user.stripePriceId);

  return (plan as Plan) || null;
};
