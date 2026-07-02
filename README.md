# Najem Store

Najem Store is a web store for oud, bakhoor, perfumes, and miswak. The project is split into a React storefront, a Laravel API, and an admin dashboard for catalog and order management.

## Features

- RTL Arabic storefront with English language support.
- Category browsing, product search, filters, product details, cart, and checkout.
- Cash-on-delivery orders with a ready WhatsApp confirmation message.
- Public API for catalog data, store settings, social links, and orders.
- Admin dashboard for products, categories, orders, profile, settings, and social links.
- Image uploads for products and categories.
- Manifest, service worker, and offline page for the storefront.

## Tech Stack

### Frontend

- React 18
- Vite
- React Router
- Context API
- lucide-react
- CSS

### Backend

- Laravel 12
- Laravel Sanctum
- MySQL
- PHPUnit
- JSON API resources and form request validation

## Project Structure

```text
Najem-Store/
  frontend/   React storefront and admin interface
  backend/    Laravel API, database migrations, seeders, and tests
  docs/       Project notes, API routes, schema, architecture, and checkout flow
```

## Getting Started

### Backend

Create the local database first:

```sql
CREATE DATABASE najem_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Then run the Laravel API:

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan storage:link
php artisan serve --host=127.0.0.1 --port=8000
```

### Frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Default local URLs:

- Frontend: `http://127.0.0.1:5173`
- Backend API: `http://127.0.0.1:8000/api`

## Environment

Frontend API URL:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Backend values to check in `backend/.env`:

```env
APP_URL=http://127.0.0.1:8000
FRONTEND_URL=http://localhost:5173
DB_CONNECTION=mysql
DB_DATABASE=najem_store
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
```

## API Overview

Public endpoints:

- `GET /api/categories`
- `GET /api/products`
- `GET /api/products/featured`
- `GET /api/settings`
- `GET /api/social-links`
- `POST /api/orders`

Admin endpoints are available under `/api/admin` and require a Sanctum bearer token after login.

## Testing

Backend tests:

```bash
cd backend
php artisan test
```

Frontend production build:

```bash
cd frontend
npm run build
```

## Documentation

- [Architecture](docs/architecture.md)
- [API routes](docs/api-routes.md)
- [Database schema](docs/database-schema.md)
- [Checkout flow](docs/whatsapp-checkout-flow.md)
- [Branding](docs/branding.md)
