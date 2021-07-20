import handler from '../../../server/api-route';
import { decodeInvitationToken } from '../../../server/invitations/token';

/**
 * Users visit this route when accepting an invitation with the invitation token as a query param
 *
 * @example
 * /api/invitations/accept?token=<jwt>
 */
export default handler().get(async (req, res) => {
  const { token } = req.query;
  if (!req.user) {
    res.redirect(`/signin?r=/api/invitations/accept/?token=${token}`);
    return;
  }

  if (typeof token !== 'string') {
    res.status(400).send('Invalid invitation.');
    return;
  }

  const payload = decodeInvitationToken(token);
  if (!payload) {
    res.status(400).send('Invalid invitation.');
    return;
  }

  res.redirect('/app/settings');
});
