# InfinityFree Deployment Helpers

These files are examples for deploying the Laravel backend to InfinityFree shared hosting.

Do not commit real `.env` files, database dumps, `vendor`, or uploaded images.

## Recommended Method: Method A

Upload the whole prepared Laravel backend into `htdocs`, then place the example `.htaccess` in `htdocs/.htaccess`. This keeps `public/index.php` unchanged and avoids editing Laravel bootstrap paths.

The root `.htaccess` forwards requests to `public/` and blocks direct access to sensitive Laravel folders.

## Method B

Move the contents of `backend/public` into `htdocs` and edit `index.php` paths to point to the backend folder outside `htdocs`. This can be cleaner, but it only works if the hosting account lets you place the Laravel app outside the web root. On InfinityFree, Method A is usually easier and safer for this project.

## Files In This Folder

- `.htaccess`: example root rewrite file for `htdocs`.
- `env.example`: production `.env` template for InfinityFree placeholders.

## Uploads

For InfinityFree, set:

```env
UPLOADS_DISK=infinityfree_public
```

Uploaded product and category images will be written to:

```text
htdocs/public/uploads
```

They will be served publicly from:

```text
https://YOUR_INFINITYFREE_DOMAIN/uploads/...
```

No `php artisan storage:link` command is required on the InfinityFree server for this upload mode.
