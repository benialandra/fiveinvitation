# FiveInvitation Database & API Audit Report
**Date:** June 14, 2026
**Status:** ⚠️ CRITICAL INTERVENTION REQUIRED

## Executive Summary
This audit traces real query execution paths from the frontend to the Node.js server (`server.ts`) and into the Supabase database. The analysis revealed **severe architectural flaws** that compromise the security, scalability, and functionality of the application in a production environment. 

---

## PHASE 1 - DATABASE STRUCTURE
**Finding:** Referential Integrity and Type Mismatches
* **Description:** The `orders.theme_id` column is defined as `VARCHAR(50)`, but it references `themes.id`, which is `VARCHAR(100)`. Furthermore, `orders.theme_id` lacks a Foreign Key (`REFERENCES public.themes(id)`) constraint entirely.
* **Impact:** Inserting a theme ID longer than 50 characters will crash the database. Deleting a theme will result in orphan orders that cannot render.
* **Risk Level:** **High**
* **Recommended Fix:** Alter `orders.theme_id` to `VARCHAR(100)` and apply a `FOREIGN KEY` constraint.

## PHASE 2 - DATA INTEGRITY
**Finding:** Unsafe Nullable Fields
* **Description:** The `orders.customer_email` column is nullable. However, the transactional email system (OTP, Payment Success) implicitly assumes it exists.
* **Impact:** Email notifications will silently fail for orders missing emails.
* **Risk Level:** **Medium**
* **Recommended Fix:** Ensure `customer_email` is required at the API level during order creation.

## PHASE 3 - API AUDIT
**Finding:** Broken Object Level Authorization (BOLA / IDOR)
* **Description:** The route `PUT /api/orders/:orderCode` is entirely unprotected. Any user who can guess or obtain an `orderCode` can send a PUT request to maliciously overwrite the bride/groom names, locations, and customizations of another user's wedding invitation.
* **Impact:** Complete data tampering for user orders.
* **Risk Level:** **Critical**
* **Recommended Fix:** Implement authentication for this route, ensuring the user owns the order (via OTP session or admin token) before allowing updates.

## PHASE 4 - QUERY PERFORMANCE
**Finding:** Unbounded Queries (Memory Exhaustion)
* **Description:** The routes `GET /api/orders` and `GET /api/themes` perform `supabase.from('table').select('*')` without any `.limit()` or pagination.
* **Impact:** If the database scales to 100,000 orders, the Node.js process will attempt to pull the entire dataset into RAM, resulting in an immediate Out-Of-Memory (OOM) crash and massive latency spikes.
* **Risk Level:** **Critical**
* **Recommended Fix:** Implement `.limit(100)` and cursor-based pagination.

## PHASE 5 - STORAGE AUDIT
**Finding:** Stateful Local Storage
* **Description:** The application uses `multer.diskStorage` to save user uploads (cover images, gallery) to `public/uploads` on the local Node.js server disk.
* **Impact:** The application is completely stateful. If deployed across multiple instances (e.g., Kubernetes, Vercel, or AWS EC2 Auto-Scaling), an image uploaded to Server A will return a 404 Not Found when a user requests it from Server B.
* **Risk Level:** **Critical**
* **Recommended Fix:** Migrate storage to Supabase Storage buckets or AWS S3 immediately. (Temporary workaround: Keep it on a single, persistent VM).

## PHASE 6 - SECURITY AUDIT
**Finding:** Flawed Supabase Client Initialization
* **Description:** `server.ts` initializes the Supabase client using `VITE_SUPABASE_ANON_KEY`. Supabase enforces Row Level Security (RLS) on the Anon Key. The SQL schema defines `CREATE POLICY "orders_update_service" ON public.orders FOR UPDATE USING (current_setting('role') = 'service_role')`.
* **Impact:** Because `server.ts` acts as an anonymous user, **ALL attempts by the server to update an order (e.g., Midtrans Webhook payment success, or the IDOR PUT route) will be silently rejected by the database due to RLS.** The application's core transaction flow is broken in production.
* **Risk Level:** **Critical**
* **Recommended Fix:** `server.ts` MUST use the `SUPABASE_SERVICE_ROLE_KEY` to bypass RLS for administrative and webhook tasks.

## PHASE 7 - TRANSACTION FLOW AUDIT
**Trace:** Create Order → Midtrans Payment → Webhook → Update DB
* **Analysis:** The `POST /api/webhook/midtrans` receives the payment notification successfully. It calculates the status correctly. However, the final step `await supabase.from('orders').update({ status }).eq('unique_code', orderId);` **fails** due to the RLS vulnerability mentioned in Phase 6.
* **Impact:** Orders will remain "PENDING" forever, even after successful payment.

## PHASE 8 - ERROR HANDLING
**Finding:** Blind Error Swallowing
* **Description:** The `POST /api/order/create` handles Supabase errors, but falls back to stripping columns silently if it fails. Several routes return `{error: "Server error"}` without detailed logging on what failed.
* **Impact:** Difficult to debug production crashes.
* **Risk Level:** **Medium**

## PHASE 9 - SCALABILITY REVIEW
**Estimate:** 
* **100 Invitations:** Works perfectly.
* **1,000 Invitations:** Memory usage on `/api/orders` spikes. Local disk fills up with uploads.
* **10,000 Invitations:** Node.js process crashes due to OOM on unbounded queries.
* **100,000 Invitations:** Complete system failure. Horizontal scaling is impossible due to local disk storage. Database latency spikes due to lack of limits.

## PHASE 10 - FINAL REPORT

### Scores
* **Database Health Score:** 6.0 / 10
* **API Quality Score:** 4.0 / 10
* **Query Performance Score:** 5.0 / 10
* **Storage Score:** 2.0 / 10
* **Security Score:** 1.0 / 10
* **Scalability Score:** 1.0 / 10

### Final Answers
1. **Is the database design production-ready?** No. Missing foreign keys and incorrect types.
2. **Are API calls implemented correctly?** No. The server uses the Anon Key instead of the Service Role key, breaking all RLS updates.
3. **Are queries efficient?** No. Unbounded full-table scans will cause OOM crashes.
4. **Are there security risks?** Yes. Critical IDOR vulnerabilities allow anyone to modify orders.
5. **Will the application scale?** No. Stateful local storage (`multer`) prevents horizontal scaling.
6. **What should be fixed first?** The Supabase Key initialization in `server.ts` to unbreak payments, followed immediately by protecting the `PUT /api/orders` route to prevent mass defacement.
