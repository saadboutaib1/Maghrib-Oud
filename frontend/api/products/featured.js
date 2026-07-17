import handler, { config } from '../[...path].js';

export { config };

export default function featuredProducts(req, res) {
  req.query = {
    ...req.query,
    path: ['products', 'featured'],
  };

  return handler(req, res);
}