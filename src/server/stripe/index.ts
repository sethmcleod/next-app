import Stripe from 'stripe';

if (process.browser)
  throw new Error('DO NOT USE stripe/server.ts IN THE BROWSER, YOU WILL EXPOSE FULL CONTROL OF THE STRIPE ACCOUNT!');

if (!process.env.STRIPE_SECRET_API_KEY) throw new Error('Please provide a STRIPE_SECRET_API_KEY environment variable.');

const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY, {
  // @ts-ignore The Stripe docs state that null denotes the Stripe account's default version and to use ts-ignore
  apiVersion: null,
  appInfo: {
    name: 'Next App',
  },
});

export default stripe;
