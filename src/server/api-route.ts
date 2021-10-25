import cookieSession from 'cookie-session';
import { NextApiRequest, NextApiResponse } from 'next';
import { error } from 'next/dist/build/output/log';
import nc from 'next-connect';

import passport from './passport';
import { trustProxyMiddleware } from './trust-proxy-middleware';

export interface Request extends NextApiRequest {
  // Passport adds these to the request object
  logout: () => void;
  user?: Express.User;
  protocol?: string;
}

const COOKIE_SECRET = process.env.COOKIE_SECRET;

/**
 * Create an API route handler with next-connect and all the necessary middlewares
 *
 * @example
 * ```ts
 * export default handler().get((req, res) => { ... })
 * ```
 */
function handler() {
  if (!COOKIE_SECRET) {
    throw new Error('Please provide a COOKIE_SECRET environmental variable.');
  }

  return (
    nc<Request, NextApiResponse>({
      onError: (err, _, res) => {
        error(err);
        res.status(500).end(err.toString());
      },
    })
      // In order for authentication to work on Vercel, req.protocol needs to be set correctly.
      // However, Vercel's reverse proxy setup breaks req.protocol, which the custom trustProxyMiddleware fixes again.
      .use(process.env.VERCEL ? trustProxyMiddleware : (_, __, next) => next())
      .use(
        cookieSession({
          name: 'session',
          keys: [COOKIE_SECRET],
          maxAge: 24 * 60 * 60 * 1000 * 30,
          // Do not change the lines below, they make cy.auth() work in e2e tests
          secure: process.env.NODE_ENV !== 'development' && !process.env.INSECURE_AUTH,
          signed: process.env.NODE_ENV !== 'development' && !process.env.INSECURE_AUTH,
        })
      )
      .use(passport.initialize())
      .use(passport.session())
  );
}

export default handler;
