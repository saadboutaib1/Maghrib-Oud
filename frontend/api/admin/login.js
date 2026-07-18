import handler, { config } from '../../server/router.js';

export { config };

export default function adminLogin(req, res) {
  req.query = {
    ...req.query,
    path: ['admin', 'login'],
  };

  return handler(req, res);
}
