import MagicLoginStrategy from 'passport-magic-login';

import { getRequestOrigin } from '../get-request-origin';
import { sendEmail } from '../send-email';

if (!process.env.MAGIC_LINK_SECRET) throw new Error(`Please add process.env.MAGIC_LINK_SECRET to your .env file!`);

const magicLink = new MagicLoginStrategy({
  secret: process.env.MAGIC_LINK_SECRET,
  callbackUrl: '/api/auth/magiclink/callback',
  sendMagicLink: async (destination, href, code, req) => {
    const link = `${getRequestOrigin(req)}${href}`;

    await sendEmail({
      to: destination,
      subject: `Your sign in link`,
      text: `Hey! Click on this link to finish signing in: ${link}\nMake sure the verification code matches ${code}!`,
    });
  },
  verify: (payload, callback) => {
    callback(undefined, {
      ...payload,
      email: payload.destination,
      provider: 'mail',
    });
  },
});

export default magicLink;
