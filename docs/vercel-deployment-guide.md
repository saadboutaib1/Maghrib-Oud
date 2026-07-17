# Vercel Deployment Guide - MAGHRIB OUD Frontend

This guide prepares the React/Vite frontend for deployment on the Vercel free Hobby plan while connecting it to the InfinityFree Laravel API.

## Deployment Target

- Hosting: Vercel
- Vercel root directory: `frontend`
- Framework: React with Vite
- Backend API: InfinityFree Laravel API
- Frontend build command: `npm run build`
- Output directory: `dist`

## Required Environment Variable

Add this variable in the Vercel project settings:

```env
VITE_API_URL=https://YOUR_INFINITYFREE_DOMAIN/api
```

Replace `https://YOUR_INFINITYFREE_DOMAIN` with the real InfinityFree backend domain.

Do not commit `frontend/.env`. Keep local-only values on your machine.

## Vercel Setup

1. Open Vercel and import the GitHub repository.
2. Select the frontend project settings.
3. Set the root directory to:

```text
frontend
```

4. Use these build settings:

```text
Framework Preset: Vite
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

5. Add the environment variable:

```text
VITE_API_URL=https://YOUR_INFINITYFREE_DOMAIN/api
```

6. Deploy the project.

## React Router Refresh Support

The project includes `frontend/vercel.json` with a rewrite rule so direct page refreshes work on routes such as:

- `/`
- `/products`
- `/categories`
- `/cart`
- `/checkout`
- `/about`
- `/contact`
- `/admin/login`
- `/admin/dashboard`
- `/admin/products`
- `/admin/orders`
- `/admin/settings`
- `/admin/profile`

## Backend Connection

After Vercel gives you the live frontend URL, add that URL to the InfinityFree Laravel `.env` values:

```env
FRONTEND_URL=https://YOUR_VERCEL_DOMAIN
CORS_ALLOWED_ORIGINS=https://YOUR_VERCEL_DOMAIN
```

Then test that the browser can call the API without CORS errors.

## Post-Deployment Tests

Run these checks after the Vercel deploy finishes:

1. Open the public store homepage.
2. Confirm categories and products load.
3. Open a product details page directly from its URL.
4. Add a product to the cart.
5. Open the cart and update quantity.
6. Complete the checkout flow and confirm the order reaches the backend.
7. Confirm the WhatsApp button opens with the configured number.
8. Open `/admin/login`.
9. Log in as admin.
10. Confirm products, categories, orders, settings, and profile pages load.
11. Test the site on mobile and tablet widths.
12. Change language and confirm the layout stays clean.

## If The Backend Is Offline

The frontend is configured to show clean service messages when the API is unreachable. If products, checkout, or admin data do not load, check:

- `VITE_API_URL` in Vercel points to the InfinityFree `/api` URL.
- The InfinityFree backend is online.
- The backend `.env` allows the Vercel domain in CORS.
- `APP_DEBUG=false` is set in production.

## Redeploying After Changes

If you change `VITE_API_URL` or any Vercel environment variable, redeploy the frontend from Vercel so the Vite build receives the new value.
