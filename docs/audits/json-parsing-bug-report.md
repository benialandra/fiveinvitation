# Theme Edit JSON Parsing Error - Bug Report

## 1. Root Cause
The "JSON Parsing Error" during Theme Edit was caused by a combination of two distinct issues:

1. **Missing Authentication Headers:** The `fetch` calls in `Admin.tsx` for `POST /api/admin/themes` and `PUT /api/admin/themes/:id` were sending `FormData` but entirely omitting the `Authorization: Bearer <token>` header. As a result, the backend `requireAdmin` middleware immediately rejected the request with a `401 Unauthorized` status and an error JSON payload (`{"error":"Unauthorized: Missing or invalid token"}`). 
2. **`undefined` Stringification via FormData:** When the `config_json` payload was empty (or untouched), the frontend `parsedConfig` was initialized to `{}` or `undefined`. `FormData.append('config_json', JSON.stringify(undefined))` inadvertently converts `undefined` into the string literal `"undefined"`. On the backend, `server.ts` attempted to run `JSON.parse("undefined")`, which triggers a hard `SyntaxError: Unexpected token u in JSON at position 0`.

## 2. Files Modified
* `src/pages/Admin.tsx`
* `server.ts`

## 3. Fix Applied
* **Frontend (`Admin.tsx`):** Injected the `headers: adminHeaders()` into the `fetch` options for both the Create and Edit theme requests. This ensures the admin token is passed correctly and bypasses the 401 Unauthorized rejection.
* **Backend (`server.ts`):** Hardened the `config_json` parsing logic in the `POST` and `PUT` endpoints. Added a strict check `if (config_json && config_json !== 'undefined')` before attempting `JSON.parse(config_json)`. This prevents the server from crashing or returning a 400 Bad Request when receiving stringified undefined payloads.
* **Security & Auth Flow (`server.ts`):** Fixed a silent failure in the `/api/admin/login` route where failed Supabase session inserts were caught but ignored, leading to valid frontend tokens that were immediately deemed invalid by `validateAdminToken`. 

## 4. Validation Result
* **Upload Thumbnail:** Selecting a new image and updating a theme now successfully uploads the image directly to Supabase storage and attaches the public URL.
* **Save Theme:** Submitting the form with the new gallery payload sends the proper `Authorization` header. The backend parses `config_json` safely, bypassing the literal `"undefined"` trap.
* **No JSON Errors:** The `JSON.parse` exception has been eliminated. The theme updates successfully, the cache is invalidated, and the new UI renders seamlessly.
