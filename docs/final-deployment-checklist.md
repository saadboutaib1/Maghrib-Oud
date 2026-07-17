# Final Deployment Checklist - MAGHRIB OUD / Najem Store

Use this checklist to deploy the Laravel backend on Railway and the React/Vite frontend on Vercel. Do not commit real `.env` files or secret values.

## 1. Railway Backend

1. Create or open the Railway project.
2. Add the backend service from the GitHub repository.
3. Set the Railway service root directory to:

```text
backend
```

4. Add a Railway MySQL database to the project.
5. Copy the MySQL connection values from Railway into the backend service variables.
6. Add the required backend variables in Railway:

```env
APP_NAME="MAGHRIB OUD API"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://YOUR_BACKEND_RAILWAY_DOMAIN
FRONTEND_URL=https://YOUR_FRONTEND_VERCEL_DOMAIN
CORS_ALLOWED_ORIGINS=https://YOUR_FRONTEND_VERCEL_DOMAIN

DB_CONNECTION=mysql
DB_HOST=
DB_PORT=3306
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

FILESYSTEM_DISK=public
SESSION_DRIVER=database
```

7. Generate `APP_KEY` safely and paste only the generated value into Railway:

```bash
php artisan key:generate --show
```

8. Keep `APP_DEBUG=false` in production.
9. Do not add any real `.env` file to GitHub.

## 2. After Railway Backend Deploy Succeeds

Run these commands from the Railway backend service shell:

```bash
php artisan migrate --force
php artisan storage:link
php artisan optimize
```

Never run `php artisan migrate:fresh` in production.

## 3. Test Backend Online

Open these endpoints in the browser or an API client after the backend deploy is live:

```text
https://YOUR_BACKEND_RAILWAY_DOMAIN/api/categories
https://YOUR_BACKEND_RAILWAY_DOMAIN/api/products
https://YOUR_BACKEND_RAILWAY_DOMAIN/api/settings
https://YOUR_BACKEND_RAILWAY_DOMAIN/api/social-links
```

Expected result: JSON responses without server errors.

## 4. Vercel Frontend

1. Create or open the Vercel project.
2. Import the same GitHub repository.
3. Set the Vercel root directory to:

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

5. Add this Vercel environment variable:

```env
VITE_API_URL=https://YOUR_BACKEND_RAILWAY_DOMAIN/api
```

6. Deploy the frontend.

## 5. After Vercel Deploy

1. Copy the final Vercel frontend URL.
2. Go back to the Railway backend service variables.
3. Update these variables with the final Vercel URL:

```env
FRONTEND_URL=https://YOUR_FRONTEND_VERCEL_DOMAIN
CORS_ALLOWED_ORIGINS=https://YOUR_FRONTEND_VERCEL_DOMAIN
```

4. If Sanctum stateful domains are used, add the Vercel domain without `https://`:

```env
SANCTUM_STATEFUL_DOMAINS=YOUR_FRONTEND_VERCEL_DOMAIN
```

5. Redeploy or restart the Railway backend service after changing variables.

## 6. Final Live Tests

Check the full production flow:

- Public products load.
- Product details page works.
- Cart works.
- Checkout creates an order in the backend.
- WhatsApp opens with the order message.
- Admin login works.
- Admin dashboard loads.
- Products CRUD works in the dashboard.
- Settings WhatsApp number updates the public site.
- A new order appears in the dashboard.
- Mobile responsive layout works on a real phone or browser device mode.

## 7. Production Safety

Before sharing the live site:

- Change the default admin password.
- Keep `APP_DEBUG=false`.
- Confirm `.env` files are not committed.
- Confirm no secrets exist in GitHub.
- Never run `migrate:fresh` in production.
- Keep database credentials only in Railway variables.
- Keep `VITE_API_URL` only in Vercel variables for production.
