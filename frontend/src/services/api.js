const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message, status = 0, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

function buildUrl(endpoint, params = {}) {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = new URL(`${API_BASE_URL}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

async function request(endpoint, options = {}) {
  const { params, body, method = 'GET', raw = false } = options;

  try {
    const response = await fetch(buildUrl(endpoint, params), {
      method,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const payload = await response.json().catch(() => null);
    const message = payload?.message || `API request failed with status ${response.status}`;

    if (!response.ok || payload?.success === false) {
      throw new ApiError(message, response.status, payload?.errors || payload);
    }

    if (raw) {
      return payload;
    }

    return payload?.data ?? payload;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError('Backend is not available right now.', 0, error);
  }
}

export function getCategories() {
  return request('/categories');
}

export function getProducts(params = {}) {
  return request('/products', { params });
}

export function getFeaturedProducts() {
  return request('/products/featured');
}

export function getProduct(id) {
  return request(`/products/${encodeURIComponent(id)}`);
}

export function getSettings() {
  return request('/settings');
}

export function getSocialLinks() {
  return request('/social-links');
}

export function createOrder(orderData) {
  return request('/orders', {
    method: 'POST',
    body: orderData,
    raw: true,
  });
}
