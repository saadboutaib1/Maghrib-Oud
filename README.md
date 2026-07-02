# Najem Store

Najem Store is a full-stack e-commerce app for oud, bakhoor, perfumes, and miswak. It includes an Arabic-first customer storefront, a Laravel API, and an admin area for managing products, categories, orders, store settings, and social links.

## Features

- Arabic-first storefront with RTL layout and English translation support.
- Product categories, product listing, search, filters, product details, cart, and checkout.
- Cash-on-delivery checkout that creates an order and opens a WhatsApp confirmation message.
- Laravel API for public catalog data, settings, social links, and orders.
- Protected admin area for catalog management, order tracking, profile/password updates, settings, and social links.
- Image upload support for products and categories.
- PWA basics: manifest, service worker, offline page, and local fallback data.

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
- [Development plan](docs/development-plan.md)

## Status

The storefront, admin interface, and Laravel API are implemented for local development. The frontend can read from the API and keeps local fallback data so the customer pages remain usable while the backend is offline.
