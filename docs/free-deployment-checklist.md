# MAGHRIB OUD Free Deployment Checklist

This checklist explains how to deploy MAGHRIB OUD for free with:

- Frontend: Vercel
- Backend API: InfinityFree shared hosting
- Database: InfinityFree MySQL

Do not commit real `.env` files, `vendor`, `node_modules`, `frontend/dist`, database dumps, passwords, API keys, or hosting credentials.

## 1. Before Deployment

Use the latest stable code before starting deployment.

- Make sure the `main` branch contains the latest work.
- Make sure there are no unfinished local changes that you do not want to deploy.
- Make sure `.env` files are ignored by Git.
- Make sure `vendor`, `node_modules`, and `frontend/dist` are not committed.
- Make sure the frontend production build passes.
- Make sure the backend route list works.

Recommended local checks:

```bash
git status
```

Frontend:

```bash
cd frontend
npm install
npm run build
```

Backend:

```bash
cd backend
composer install
php artisan route:list
```

Important: never run `php artisan migrate:fresh` on production data.

## 2. InfinityFree Backend Setup

InfinityFree will host the Laravel backend API and MySQL database.

### Create Hosting

1. Create an InfinityFree account.
2. Create a new hosting account.
3. Choose a free domain or subdomain.
4. Open the hosting control panel.
5. Confirm the website domain is active.

### Create MySQL Database

1. Open the MySQL database section in InfinityFree.
2. Create a new MySQL database.
3. Copy these values and keep them private:

- DB host
- DB name
- DB username
- DB password

Do not paste these values into GitHub, README files, screenshots, or public messages.

### Prepare Backend Files Locally

On your computer, prepare Laravel for shared hosting:

```bash
cd backend
composer install --no-dev --optimize-autoloader
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan key:generate --show
```

Use the generated key as `APP_KEY` in the hosting `.env` file.

### Prepare Backend `.env`

Create the production `.env` on the hosting server or prepare it locally only for the upload package. Do not commit it.

Use placeholders like this and replace them inside InfinityFree with real values:

```env
APP_NAME="MAGHRIB OUD"
APP_ENV=production
APP_KEY=base64:YOUR_GENERATED_APP_KEY
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

### Upload Backend To `htdocs`

Recommended method for this project:

1. Upload the Laravel backend files to InfinityFree `htdocs`.
2. Include `vendor` in the manual upload package because InfinityFree does not provide Composer on the server.
3. Do not upload `node_modules`, frontend `dist`, local logs, or local development files.
4. Add the shared-hosting `.htaccess` helper from `deploy/infinityfree/.htaccess` if using the whole-backend-in-htdocs method.
5. Make sure uploaded images can be stored in:

```text
htdocs/public/uploads
```

The public image URL should look like:

```text
https://YOUR_INFINITYFREE_DOMAIN/uploads/IMAGE_NAME
```

### Import SQL Database

InfinityFree cannot run Laravel migrations on the server, so prepare the database manually.

1. Run migrations locally against your local database.
2. Add the products, categories, settings, admin account, and test data you want.
3. Export the local database as an SQL file from phpMyAdmin.
4. Open InfinityFree phpMyAdmin.
5. Import the SQL file into the InfinityFree MySQL database.

Do not import destructive test data over a real production database unless you are sure.

### Test Backend API

Open these URLs in the browser after upload and database import:

```text
https://YOUR_INFINITYFREE_DOMAIN/api/categories
https://YOUR_INFINITYFREE_DOMAIN/api/products
https://YOUR_INFINITYFREE_DOMAIN/api/settings
```

Expected result: JSON responses, not a Laravel error page.

## 3. Vercel Frontend Setup

Vercel will host the React/Vite frontend.

1. Open Vercel.
2. Import the GitHub repository.
3. Set the project root directory to:

```text
frontend
```

4. Use these build settings:

```text
Framework: Vite
Build command: npm run build
Output directory: dist
```

5. Add this environment variable in Vercel:

```env
VITE_API_URL=https://YOUR_INFINITYFREE_DOMAIN/api
```

6. Deploy the frontend.

Do not commit `frontend/.env`. Vercel environment variables should be configured in the Vercel dashboard.

## 4. Connect Backend And Frontend

After Vercel gives you the frontend URL, update the InfinityFree backend `.env`:

```env
FRONTEND_URL=https://YOUR_VERCEL_DOMAIN
CORS_ALLOWED_ORIGINS=https://YOUR_VERCEL_DOMAIN
```

Then test the Vercel frontend in the browser.

If you change these backend values, clear Laravel config cache locally before packaging again. On InfinityFree, upload the updated `.env` carefully because there is no SSH or Artisan on the server.

## 5. Final Tests

Run these tests after both deployments are online:

- Home page loads.
- Products load from the backend.
- Categories load from the backend.
- Product details page opens correctly.
- Add to cart works.
- Cart quantity updates correctly.
- Checkout creates a backend order.
- WhatsApp opens with the configured number and order message.
- Admin login works.
- Dashboard can add and edit a product.
- Product added from dashboard appears in the public store.
- Product image upload works and image appears publicly.
- Settings WhatsApp number changes public WhatsApp links.
- Orders appear in the dashboard after checkout.
- Language switching works.
- Mobile responsive layout works.
- Tablet responsive layout works.

## 6. Important Limitations

InfinityFree is useful for free testing, demos, and portfolio projects, but it is shared hosting.

Important limitations:

- No SSH access on the server.
- No Composer on the server.
- No Artisan commands on the server.
- Laravel migrations must be run locally.
- Database must be exported locally and imported manually through phpMyAdmin.
- File uploads depend on the shared hosting filesystem.
- Performance can be limited compared with paid Laravel hosting.
- It is not ideal for a large production e-commerce app with many users, heavy uploads, queues, or advanced background jobs.

Recommended use: demo, portfolio, first online test, and free validation before moving to stronger hosting.

## 7. Emergency Fixes

### If You See A 500 Error

Check:

- `APP_DEBUG=false` in production.
- `APP_KEY` is set and valid.
- Database credentials are correct.
- Required folders are uploaded.
- `vendor` is included in the manual upload package.
- File permissions allow Laravel to write to `storage` and `bootstrap/cache` if needed.
- The `.htaccess` rewrite points requests to Laravel `public` correctly.

### If You See An API CORS Error

Check:

- `FRONTEND_URL` equals the real Vercel URL.
- `CORS_ALLOWED_ORIGINS` equals the real Vercel URL.
- Vercel `VITE_API_URL` points to `https://YOUR_INFINITYFREE_DOMAIN/api`.
- The frontend is using HTTPS when calling the backend.
- The backend API URL opens directly in the browser.

### If Products Do Not Load

Check:

- `VITE_API_URL` in Vercel is correct.
- `/api/products` returns JSON directly in the browser.
- The database import includes products and categories.
- Products and categories are active in the database.
- The backend is not returning a 500 error.

### If Admin Cannot Login

Check:

- Admin user exists in the imported database.
- Password hash was imported correctly.
- Backend `/api/admin/login` is reachable.
- Database credentials are correct.
- Browser console does not show CORS errors.
- The frontend Vercel domain is allowed by backend CORS.

### If Images Do Not Show

Check:

- Uploaded files exist in `htdocs/public/uploads`.
- Database image paths point to public URLs or public upload paths.
- `APP_URL` matches the InfinityFree backend domain.
- `UPLOADS_DISK=infinityfree_public` is set for InfinityFree.
- Image file names do not contain unsafe characters.
- The image URL opens directly in the browser.

## First Manual Step

Start with InfinityFree backend setup first. The frontend needs the final backend API URL before Vercel can be configured correctly.
