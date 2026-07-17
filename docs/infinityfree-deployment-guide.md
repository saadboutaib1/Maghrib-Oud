# InfinityFree Deployment Guide - MAGHRIB OUD Backend

This guide explains how to deploy the MAGHRIB OUD Laravel backend to InfinityFree shared hosting while the React/Vite frontend stays on Vercel.

InfinityFree free hosting does not provide SSH, Composer, Artisan, Git deploys, or an easy custom document root. Prepare the backend locally, upload the finished Laravel package manually, and import the database through phpMyAdmin.

## Target

- Backend host: InfinityFree
- Backend domain: `https://maghrib-oud.infinityfree.me`
- Backend upload folder: `htdocs`
- Database: InfinityFree MySQL
- Frontend host: Vercel
- Recommended method: upload the whole Laravel backend into `htdocs` and use a root `.htaccess` rewrite to `public/`

## 1. InfinityFree Account And Hosting

1. Create an InfinityFree account.
2. Create a new hosting account.
3. Use the free domain/subdomain:

```text
maghrib-oud.infinityfree.me
```

4. Open the hosting control panel.
5. Open File Manager or prepare FTP credentials.
6. Confirm the web root folder is named:

```text
htdocs
```

## 2. InfinityFree MySQL Database

Use the MySQL database values below. The password must be added manually later and must not be committed.

```env
DB_CONNECTION=mysql
DB_HOST=sql311.infinityfree.com
DB_PORT=3306
DB_DATABASE=if0_42434243_maghrib_oud
DB_USERNAME=if0_42434243
DB_PASSWORD=YOUR_INFINITYFREE_DB_PASSWORD
```

Keep the real DB password only in InfinityFree and in the production `.env` file you upload manually.

## 3. Shared Hosting Structure

Recommended structure after upload:

```text
htdocs/
  app/
  bootstrap/
  config/
  database/
  public/
    index.php
    .htaccess
    uploads/
  resources/
  routes/
  storage/
  vendor/
  .env
  .htaccess
  artisan
  composer.json
  composer.lock
```

Copy `deploy/infinityfree/.htaccess` to:

```text
htdocs/.htaccess
```

That file forwards requests to Laravel `public/`:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

Keep `backend/public/index.php` unchanged. Its paths already match the whole-backend-in-htdocs method.

Keep `backend/public/.htaccess` unchanged. Laravel needs it for clean API routes and front controller routing.

## 4. Prepare Backend Locally

Run these commands on your computer, not on InfinityFree:

```bash
cd backend
composer install --no-dev --optimize-autoloader
php artisan key:generate --show
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

Copy the generated `APP_KEY` value and paste it into the production `.env` file.

Do not commit `vendor` to Git. Include `vendor` only in the manual ZIP/FTP upload because InfinityFree cannot run Composer on the server.

## 5. Create The Production `.env`

Use `backend/.env.infinityfree.example` or `deploy/infinityfree/env.example` as your template.

Create the real `.env` manually for the hosting upload. Do not commit it.

```env
APP_NAME="MAGHRIB OUD"
APP_ENV=production
APP_KEY=base64:YOUR_GENERATED_APP_KEY
APP_DEBUG=false
APP_URL=https://maghrib-oud.infinityfree.me

FRONTEND_URL=https://maghrib-oud.vercel.app
CORS_ALLOWED_ORIGINS=https://maghrib-oud.vercel.app,https://maghrib-oud.infinityfree.me

DB_CONNECTION=mysql
DB_HOST=sql311.infinityfree.com
DB_PORT=3306
DB_DATABASE=if0_42434243_maghrib_oud
DB_USERNAME=if0_42434243
DB_PASSWORD=YOUR_INFINITYFREE_DB_PASSWORD

FILESYSTEM_DISK=public
UPLOADS_DISK=infinityfree_public
SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync
```

Important:

- Keep `APP_DEBUG=false` online.
- Replace `APP_KEY` with the generated key.
- Replace `DB_PASSWORD` manually with the real InfinityFree database password.
- The Vercel frontend URL is already configured. Keep both origins in `CORS_ALLOWED_ORIGINS` so browser API requests and direct backend checks work.

## 6. Upload Backend Package To `htdocs`

Prepare a ZIP or FTP upload from the backend folder.

Include:

- `app/`
- `bootstrap/`
- `config/`
- `database/`
- `public/`
- `resources/`
- `routes/`
- `storage/`
- `vendor/`
- `.env`
- `.htaccess` from `deploy/infinityfree/.htaccess`
- `artisan`
- `composer.json`
- `composer.lock`

Do not include:

- `.git/`
- real local `.env` files not intended for production
- `node_modules/`
- frontend `dist/`
- local logs
- database dumps in the web root

## 7. Import Database SQL Through phpMyAdmin

InfinityFree cannot run `php artisan migrate` on the server.

Use this flow:

1. Run migrations locally against your local MySQL database.
2. Add the admin account, settings, categories, products, and content you want online.
3. Export the local database as SQL using phpMyAdmin or another MySQL tool.
4. Open InfinityFree phpMyAdmin.
5. Select database `if0_42434243_maghrib_oud`.
6. Import the SQL file.

Do not run `migrate:fresh` on production data.

Do not commit SQL dumps to Git.

## 8. Image Uploads On InfinityFree

This project supports a shared-hosting upload disk:

```env
UPLOADS_DISK=infinityfree_public
```

With this setting, dashboard product/category images are stored in:

```text
htdocs/public/uploads
```

They are served from:

```text
https://maghrib-oud.infinityfree.me/uploads/...
```

This avoids needing `php artisan storage:link` on InfinityFree.

## 9. Test Backend After Upload

Open these URLs after the upload and database import:

```text
https://maghrib-oud.infinityfree.me/api/categories
https://maghrib-oud.infinityfree.me/api/products
https://maghrib-oud.infinityfree.me/api/settings
```

Expected result: JSON responses.

If `/api/categories` returns 500, check:

- `.env` exists in `htdocs`.
- `APP_KEY` is set.
- `APP_DEBUG=false`.
- DB host/name/user/password are correct.
- `vendor/` was uploaded.
- `storage/` and `bootstrap/cache/` are writable.
- `htdocs/.htaccess` exists and points to `public/`.

## 10. Connect Vercel Frontend Later

In Vercel, set:

```env
VITE_API_URL=https://maghrib-oud.infinityfree.me/api
```

After Vercel deployment, update backend `.env`:

```env
FRONTEND_URL=https://maghrib-oud.vercel.app
CORS_ALLOWED_ORIGINS=https://maghrib-oud.vercel.app,https://maghrib-oud.infinityfree.me
```

Then test checkout, admin login, products, and image loading from the Vercel frontend.
