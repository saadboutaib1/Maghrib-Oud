import handler, { config } from '../../server/router.js';

export { config };

export default function adminProfile(req, res) {
  req.query = {
    ...req.query,
    path: ['admin', 'profile'],
  };

  return handler(req, res);
}
