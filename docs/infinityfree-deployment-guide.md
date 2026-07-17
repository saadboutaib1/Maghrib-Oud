# InfinityFree Deployment Guide - MAGHRIB OUD / Najem Store Backend

This guide explains how to deploy the Laravel backend to InfinityFree shared hosting while keeping the React/Vite frontend on Vercel.

InfinityFree does not provide SSH, Composer, Artisan, Git deploys, or a configurable document root on the free hosting plan. Prepare everything locally, upload the finished backend manually, and import the database through phpMyAdmin.

References:

- InfinityFree Laravel guide: https://forum.infinityfree.com/t/how-to-install-a-laravel-site-on-infinityfree/118578
- InfinityFree `.htaccess` Laravel method: https://forum.infinityfree.com/t/htaccess-for-laravel/24518

## Deployment Summary

- Backend host: InfinityFree
- Backend upload location: `htdocs`
- Database: InfinityFree MySQL
- Frontend host: Vercel
- Recommended Laravel method for this project: Method A
- Uploaded image storage on InfinityFree: `htdocs/public/uploads`

## 1. Create InfinityFree Hosting

1. Create an InfinityFree account.
2. Create a hosting account.
3. Choose the free subdomain or connect your own domain.
4. Open the hosting control panel.
5. Open File Manager or prepare FTP credentials.
6. Confirm the web root folder is named:

```text
htdocs
```

## 2. Create InfinityFree MySQL Database

1. Open the InfinityFree control panel.
2. Go to MySQL Databases.
3. Create a new database.
4. Save these values:

```text
DB_HOST
DB_DATABASE
DB_USERNAME
DB_PASSWORD
DB_PORT=3306
```

Use the database host shown by InfinityFree. It is usually not `localhost`.

## 3. Recommended Method: Method A

Upload the whole prepared Laravel backend into `htdocs` and add a root `.htaccess` file that sends all requests to the Laravel `public` folder.

This is the method chosen for MAGHRIB OUD because it:

- Works without SSH.
- Works without changing `public/index.php`.
- Keeps local development unchanged.
- Matches InfinityFree's documented Laravel workaround.
- Avoids manually moving Laravel bootstrap paths.

Expected server structure:

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

The file contains:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

Do not delete or modify `htdocs/public/.htaccess`; Laravel needs it for routing requests to `index.php`.

## 4. Alternative Method: Method B

Move only the contents of `backend/public` into `htdocs`, keep the rest of Laravel outside `htdocs`, and edit `index.php` paths to point to the backend folder.

This can be cleaner when the host lets you place private Laravel files outside the web root, but it is more fragile on InfinityFree and easier to misconfigure. It is not the recommended method for this project unless you are sure your hosting account supports that structure.

## 5. Prepare Laravel Locally

Run these commands on your computer, not on InfinityFree:

```bash
cd backend
composer install --no-dev --optimize-autoloader
php artisan key:generate --show
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

Copy the generated `APP_KEY` value and keep it for the hosting `.env` file.

If InfinityFree reports missing classes after upload, regenerate the autoloader locally without optimization and upload `vendor` again:

```bash
composer dump-autoload --no-dev --optimize=false
```

Do not commit `vendor` to Git. It is included only in the manual ZIP/FTP upload.

## 6. Configure InfinityFree `.env`

Use `backend/.env.infinityfree.example` or `deploy/infinityfree/env.example` as the template. Create a real `.env` locally for the ZIP upload or directly in File Manager. Do not commit it.

Required values:

```env
APP_NAME="MAGHRIB OUD"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://YOUR_INFINITYFREE_DOMAIN

FRONTEND_URL=https://YOUR_VERCEL_DOMAIN
CORS_ALLOWED_ORIGINS=https://YOUR_VERCEL_DOMAIN

DB_CONNECTION=mysql
DB_HOST=YOUR_INFINITYFREE_DB_HOST
DB_PORT=3306
DB_DATABASE=YOUR_INFINITYFREE_DB_NAME
DB_USERNAME=YOUR_INFINITYFREE_DB_USERNAME
DB_PASSWORD=YOUR_INFINITYFREE_DB_PASSWORD

FILESYSTEM_DISK=public
UPLOADS_DISK=infinityfree_public
SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync
```

Important production settings:

- `APP_DEBUG=false`
- `SESSION_DRIVER=file`
- `CACHE_STORE=file`
- `QUEUE_CONNECTION=sync`
- `UPLOADS_DISK=infinityfree_public`

## 7. Image Upload Handling

InfinityFree cannot run `php artisan storage:link` on the server. This project includes a shared-hosting upload disk named:

```env
UPLOADS_DISK=infinityfree_public
```

With that setting, product and category images uploaded from the admin dashboard are stored in:

```text
htdocs/public/uploads
```

They are served publicly from:

```text
https://YOUR_INFINITYFREE_DOMAIN/uploads/...
```

This avoids symlinks and keeps local development unchanged. Local and Railway deployments can continue using:

```env
UPLOADS_DISK=public
```

## 8. Prepare The Database Locally

InfinityFree cannot run migrations or seeders on the server. Prepare the database locally first.

Recommended local flow:

```bash
cd backend
php artisan migrate --force
```

If you need demo catalog data locally, run the seeders locally only when you intentionally want demo data in the export.

Do not run `migrate:fresh` on production data.

## 9. Export Database SQL

Use your local phpMyAdmin, MySQL Workbench, or another MySQL tool:

1. Select the local MAGHRIB OUD database.
2. Export it as SQL.
3. Do not include unrelated databases.
4. Review the SQL file before uploading if it contains customer test data.

Do not commit SQL dumps to Git.

## 10. Import SQL Into InfinityFree

1. Open InfinityFree control panel.
2. Open phpMyAdmin for the created database.
3. Select the InfinityFree database.
4. Import the SQL file exported locally.
5. If import fails because of MySQL engine or foreign key limitations, use Railway/MySQL hosting instead or adjust manually with care. Do not change migrations blindly on production.

## 11. Upload Files To `htdocs`

Upload the prepared backend contents to `htdocs` using File Manager or FTP.

Include in the manual upload:

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

Do not upload:

- `node_modules/`
- frontend `dist/`
- development screenshots or logs
- `.git/`
- unused local database dumps

## 12. Test Backend Online

Open these endpoints after upload:

```text
https://YOUR_INFINITYFREE_DOMAIN/api/health
https://YOUR_INFINITYFREE_DOMAIN/api/categories
https://YOUR_INFINITYFREE_DOMAIN/api/products
https://YOUR_INFINITYFREE_DOMAIN/api/settings
https://YOUR_INFINITYFREE_DOMAIN/api/social-links
```

Expected result: JSON responses without 500 errors.

If you see a 500 error, temporarily check hosting error logs and verify:

- `.env` exists.
- `APP_KEY` is set.
- Database credentials are correct.
- `vendor/` was uploaded.
- `storage/` and `bootstrap/cache/` are writable.

Do not enable debug publicly for long periods.

## 13. Connect Vercel Frontend

In Vercel, set the frontend environment variable:

```env
VITE_API_URL=https://YOUR_INFINITYFREE_DOMAIN/api
```

Redeploy the Vercel frontend after changing it.

Then update backend `.env` on InfinityFree:

```env
FRONTEND_URL=https://YOUR_VERCEL_DOMAIN
CORS_ALLOWED_ORIGINS=https://YOUR_VERCEL_DOMAIN
```

This project reads CORS origins from `FRONTEND_URL` and `CORS_ALLOWED_ORIGINS`.

## 14. Final Live Tests

After backend and frontend are both live:

- Public products load.
- Product details page works.
- Cart works.
- Checkout creates an order.
- WhatsApp opens with the order message.
- Admin login works.
- Admin product/category CRUD works.
- Image upload stores files under `public/uploads`.
- Settings WhatsApp number updates the public site.
- Orders appear in the admin dashboard.
- Mobile layout works from a phone.

## 15. Production Safety

- Keep `.env` out of Git.
- Keep `vendor` out of Git.
- Keep SQL dumps out of Git.
- Keep `APP_DEBUG=false`.
- Change the admin password after deployment.
- Never run `migrate:fresh` against production data.
- Keep real database credentials only inside InfinityFree control panel or `.env` on hosting.
