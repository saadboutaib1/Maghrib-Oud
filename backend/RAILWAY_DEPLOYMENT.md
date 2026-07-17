# Railway Deployment Notes

This backend is a Laravel API intended to run on Railway with the service root set to `backend`.

## Railway Service Setup

- Create a Railway service from the GitHub repository.
- Set the service root directory to:

```text
backend
```

- Railway should use the `backend/Dockerfile` in this directory.
- Do not set a conflicting `Procfile`, `nixpacks.toml`, or `railway.json` unless you intentionally stop using Docker.

## Required Railway Variables

Set these variables in the Railway backend service. Use real values in Railway only; do not commit `.env`.

```env
APP_NAME="MAGHRIB OUD API"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://YOUR_BACKEND_RAILWAY_DOMAIN
FRONTEND_URL=https://YOUR_FRONTEND_VERCEL_DOMAIN
CORS_ALLOWED_ORIGINS=https://YOUR_FRONTEND_VERCEL_DOMAIN
PORT=8080

DB_CONNECTION=mysql
DB_HOST=
DB_PORT=3306
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

FILESYSTEM_DISK=public
UPLOADS_DISK=public
SESSION_DRIVER=database
QUEUE_CONNECTION=database
CACHE_STORE=file
LOG_LEVEL=warning

SESSION_SECURE_COOKIE=true
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=lax
SANCTUM_STATEFUL_DOMAINS=YOUR_FRONTEND_VERCEL_DOMAIN
SANCTUM_TOKEN_EXPIRATION=720
```

Generate `APP_KEY` locally or in a safe shell and paste only the value into Railway:

```bash
php artisan key:generate --show
```

## Railway MySQL Variables

When you add a Railway MySQL database, copy its connection values into the Laravel variables above:

- `DB_HOST` from Railway MySQL host
- `DB_PORT` from Railway MySQL port, usually `3306`
- `DB_DATABASE` from Railway MySQL database name
- `DB_USERNAME` from Railway MySQL username
- `DB_PASSWORD` from Railway MySQL password

If Railway provides a MySQL URL, keep Laravel variables explicit unless you intentionally configure `DB_URL`.

## CORS And Frontend

The frontend is deployed separately on Vercel. Set both variables to the final Vercel URL:

```env
FRONTEND_URL=https://YOUR_FRONTEND_VERCEL_DOMAIN
CORS_ALLOWED_ORIGINS=https://YOUR_FRONTEND_VERCEL_DOMAIN
SANCTUM_STATEFUL_DOMAINS=YOUR_FRONTEND_VERCEL_DOMAIN
```

`SANCTUM_STATEFUL_DOMAINS` should be the domain without `https://`.

## Docker/Apache Notes

The Docker image uses `php:8.3-apache` with Laravel served from:

```text
/var/www/html/public
```

Apache is configured to use one MPM only for mod_php:

- `mpm_event` disabled
- `mpm_worker` disabled
- `mpm_prefork` enabled
- `rewrite` enabled for Laravel `public/.htaccess`

The entrypoint rewrites Apache `Listen` and `<VirtualHost>` to Railway's `PORT` value before starting Apache.

## Commands After First Successful Deploy

Run these from the Railway service shell after the first successful deployment:

```bash
php artisan migrate --force
php artisan storage:link
php artisan optimize
```

Do not run `migrate:fresh` on production.

## Verification

After deployment, check:

```text
GET https://YOUR_BACKEND_RAILWAY_DOMAIN/api/health
```

Expected response:

```json
{"status":"ok"}
```

Then configure the Vercel frontend with:

```env
VITE_API_URL=https://YOUR_BACKEND_RAILWAY_DOMAIN
```
