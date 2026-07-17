import handler, { config } from '../../[...path].js';

export { config };

export default function adminCategory(req, res) {
  const rawId = req.query?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  req.query = {
    ...req.query,
    path: ['admin', 'categories', id],
  };

  return handler(req, res);
}