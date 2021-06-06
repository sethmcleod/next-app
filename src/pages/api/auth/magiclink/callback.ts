import { NextApiResponse } from 'next';
import passport from 'passport';

import handler, { Request } from '../../../../server/api-route';

export default handler()
  .use(passport.authenticate('magiclogin'))
  .use((req: Request, res: NextApiResponse) => {
    res.redirect(req.user?.redirect || '/app');
  });
