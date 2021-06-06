import handler from '../../../../server/api-route';
import magicLink from '../../../../server/passport/magicLink';

export default handler().post(magicLink.send);
