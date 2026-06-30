import { categories as demoCategories } from '../data/categories.js';
import { products as demoProducts } from '../data/products.js';
import { getLocalizedField } from '../utils/formatters.js';
import { adaptCategories, adaptProducts } from '../utils/adapters.js';

const localCategories = adaptCategories(demoCategories);
const localProducts = adaptProducts(demoProducts);

export function getCategories() {
  return localCategories;
}

export function getCategoryBySlug(slug) {
  return localCategories.find((category) => category.slug === slug);
}

export function getProducts() {
  return localProducts;
}

export function getProductById(productId) {
  return localProducts.find(
    (product) => String(product.id) === String(productId) || product.slug === productId
  );
}

export function getFeaturedProducts(limit = 4) {
  return localProducts.filter((product) => product.isFeatured).slice(0, limit);
}

export function getRelatedProducts(product, limit = 3) {
  if (!product) return [];

  return localProducts
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, limit);
}

export function filterProductList(products, { category = 'all', searchTerm = '', language = 'ar' } = {}) {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return products.filter((product) => {
    const matchesCategory = category === 'all' || product.category === category;
    const localizedName = getLocalizedField(product, 'name', language).toLowerCase();
    const localizedDescription = getLocalizedField(product, 'description', language).toLowerCase();
    const matchesSearch =
      !normalizedSearch ||
      localizedName.includes(normalizedSearch) ||
      localizedDescription.includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });
}

export function filterProducts(options = {}) {
  return filterProductList(localProducts, options);
}
