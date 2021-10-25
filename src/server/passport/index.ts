import passport from 'passport';

import prisma from '../db/prisma';
import magicLink from './magicLink';

passport.use(magicLink);

// This types passport.serializeUser and passport.deserializeUser
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      id: string;
      email: string;
      provider: string;
      redirect?: string;
    }
  }
}

passport.serializeUser(async (u: Express.User, done) => {
  // Emails should not be case sensitive
  const email = u.email.toLowerCase();
  const user = await prisma.user.upsert({
    create: {
      email,
    },
    update: {},
    where: {
      email,
    },
  });

  done(null, {
    ...u,
    id: user.id,
  });
});

passport.deserializeUser(async (user: Express.User, done) => {
  done(null, user);
});

export default passport;
