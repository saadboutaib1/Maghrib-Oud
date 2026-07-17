import handler, { config } from '../../[...path].js';

export { config };

export default function adminCategories(req, res) {
  req.query = {
    ...req.query,
    path: ['admin', 'categories'],
  };

  return handler(req, res);
}