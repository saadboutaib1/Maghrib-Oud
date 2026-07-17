import handler, { config } from '../[...path].js';

export { config };

export default function adminCatchAll(req, res) {
  const rawPath = req.query?.path;
  const nestedSegments = Array.isArray(rawPath)
    ? rawPath
    : rawPath
      ? [rawPath]
      : [];

  req.query = {
    ...req.query,
    path: ['admin', ...nestedSegments],
  };

  return handler(req, res);
}