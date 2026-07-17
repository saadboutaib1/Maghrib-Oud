import handler, { config } from '../../[...path].js';

export { config };

export default function adminProducts(req, res) {
  req.query = {
    ...req.query,
    path: ['admin', 'products'],
  };

  return handler(req, res);
}