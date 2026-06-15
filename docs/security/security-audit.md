# Security Audit Report
**Date:** 2026-06-14

## Overview
A comprehensive security review was conducted across environment variables, Supabase policies, file upload handlers, admin routes, and storage mechanisms. Several critical vulnerabilities were discovered that require immediate remediation.

---

## 1. Exposed Secrets (CRITICAL)
Sensitive credentials have been committed directly into the repository via `.env.example`. 
- **SMTP Password:** A Google App Password (`your_google_app_key`) is exposed in plain text.
- **Midtrans Server Key:** A real Midtrans API key (`your_midtrans_client_key`) is exposed.
- **Default Admin Password:** The default password `your_admin_password` is hardcoded in the example environment, posing a severe risk if deployed without modification.

*Recommendation:* Immediately revoke and regenerate the exposed SMTP password and Midtrans keys. Remove real credentials from `.env.example` and replace them with generic placeholders (e.g., `your_smtp_password_here`, `your_midtrans_client_key_here`, `your_admin_password_here`).

---

## 2. Public Write Access & IDOR (CRITICAL)
- **Unauthenticated Order Updates:** The `PUT /api/orders/:orderCode` route in `server.ts` completely lacks authentication middleware (`requireAdmin` or owner verification). Any user can modify the details (names, dates, story, customizations) and upload new images for **any order** simply by knowing or guessing the `orderCode`. This is a severe Insecure Direct Object Reference (IDOR) vulnerability.
- **Supabase Policies:** RLS policies (`orders_insert_public`, `guestbooks_insert_public`, `rsvp_insert_public`) allow unrestricted public inserts. Without rate limiting or CAPTCHAs applied directly to these tables, the database is highly vulnerable to spam and DoS attacks.

*Recommendation:* Add authentication/authorization checks to `PUT /api/orders/:orderCode` so only the order owner or an admin can modify it. Implement strict rate limiting or CAPTCHAs for public Supabase insert policies.

---

## 3. Unsafe Uploads & Remote Code Execution (HIGH)
- **Mimetype Spoofing:** The `multer` upload middleware in `server.ts` restricts files using `file.mimetype`. However, mimetypes are provided by the client and are trivially spoofed. There is no "magic number" (file signature) validation to ensure an uploaded file is genuinely an image.
- **Admin RCE Vector:** The `POST /api/admin/themes/upload-component` route allows uploading `.tsx` React components. Because it relies on the global image-only multer instance, a user can upload a malicious script by spoofing the mimetype to `image/jpeg`. The server then writes this executable code directly to `src/themes` and runs `npm run build`. If an attacker compromises the admin account (e.g., via the default `your_admin_password` password), they can achieve full Remote Code Execution (RCE) on the host server.

*Recommendation:* Use a library like `file-type` to validate file signatures securely based on file contents, not client-provided mimetypes. Re-evaluate the architectural decision to allow admins to upload executable `.tsx` files directly to the server; consider safer alternatives like compiling components in an isolated CI/CD pipeline.

---

## 4. Storage Access (MODERATE)
- Uploaded files are stored in `public/uploads` and served statically via Express. While directory listing is disabled by default, any uploaded file is publicly accessible to anyone who guesses the filename (which incorporates `Date.now()`). 

*Recommendation:* If uploaded files (like private wedding photos or ID cards) require privacy, they should be stored in a private bucket (e.g., Supabase Storage with RLS) rather than a public static directory.
