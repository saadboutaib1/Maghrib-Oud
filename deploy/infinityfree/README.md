# InfinityFree Deployment Helpers

These files help you prepare the MAGHRIB OUD Laravel backend for manual upload to InfinityFree shared hosting.

Do not commit real `.env` files, database dumps, `vendor`, uploaded images, or hosting credentials.

## Recommended Method

Use Method A for this project:

1. Prepare the Laravel backend locally.
2. Upload the whole prepared backend package into InfinityFree `htdocs`.
3. Copy this folder's `.htaccess` file to `htdocs/.htaccess`.
4. Keep `backend/public/index.php` unchanged.
5. Keep `backend/public/.htaccess` unchanged.

This method works better on InfinityFree because the free plan does not provide SSH, Composer, Artisan, or an easy custom document root.

## Files In This Folder

- `.htaccess`: root rewrite file for `htdocs`; it forwards requests to Laravel `public/`.
- `env.example`: InfinityFree `.env` template with real non-secret DB host/name/user and a password placeholder.

## Manual Upload Notes

Include `vendor` inside the manual ZIP or FTP upload because InfinityFree cannot run Composer on the server.

Do not commit `vendor` to Git.

Do not upload frontend `node_modules`, frontend `dist`, `.git`, local logs, local `.env` files, or SQL dumps unless you are importing them through phpMyAdmin.

## Database

Create the InfinityFree MySQL database, then import the prepared SQL file through InfinityFree phpMyAdmin.

Configured placeholders:

```env
DB_HOST=sql311.infinityfree.com
DB_PORT=3306
DB_DATABASE=if0_42434243_maghrib_oud
DB_USERNAME=if0_42434243
DB_PASSWORD=YOUR_INFINITYFREE_DB_PASSWORD
```

The real password must be added manually in the server `.env` file only.

## Uploads

For dashboard image uploads on InfinityFree, use:

```env
UPLOADS_DISK=infinityfree_public
```

Uploaded product and category images will be stored in:

```text
htdocs/public/uploads
```

They will be served from:

```text
https://maghrib-oud.infinityfree.me/uploads/...
```

No `php artisan storage:link` command is required on the InfinityFree server for this upload mode.

## First Backend Test

After upload and database import, open:

```text
https://maghrib-oud.infinityfree.me/api/categories
```

You should see JSON, not a Laravel error page.
