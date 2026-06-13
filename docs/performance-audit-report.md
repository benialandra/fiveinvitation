# FiveInvitation Performance Audit Report

## 1. Executive Summary
The FiveInvitation platform utilizes a modern React + Vite architecture. Overall, it achieves excellent code-splitting across its 116+ themes. However, there are significant bottlenecks related to massive WebGL chunks (`Points`), unoptimized hero images, and the lack of server-side caching for Supabase requests.

## 2. Current Performance Estimation
* **Performance:** ~75-80 (bottlenecked by large JavaScript payloads and unoptimized images)
* **Accessibility:** ~90 (standard React components)
* **Best Practices:** ~85 (minor console warnings)
* **SEO:** ~90 (robots.txt and dynamic OpenGraph implemented)

## 3. Bundle Analysis Report
The Vite build output revealed several oversized chunks:
* **Points-DtjZqeZX.js (894.05 kB):** This contains the `@react-three/fiber` and WebGL dependencies. It is massive and will block the main thread.
* **index-DvstcASL.js (441.90 kB):** The main React + Framer Motion vendor bundle.
* **Admin-D91fU7i4.js (449.62 kB):** Admin dashboard dependencies.
* **supabase-F0k38LbG.js (210.90 kB):** The Supabase client library.
* **ScrollTrigger-D5RyRPCp.js (133.76 kB):** GSAP ScrollTrigger plugin.

**Critical Issues:** The unminified 894KB `Points` chunk is too large. Even gzipped, it's ~241KB of pure JavaScript parse/compile time that significantly hurts Time to Interactive (TTI).

## 4. Theme Loading Analysis
* **Status:** **EXCELLENT**
* **Findings:** The `src/themes/registry.tsx` correctly implements `React.lazy()` for all 116+ themes.
* As seen in the build output, themes are separated into tiny individual chunks (e.g., `Minimal01` is only `1.02 kB`). Themes only load when requested, preventing a multi-megabyte initial page load.

## 5. Image Optimization Report
* **Status:** **POOR**
* **Findings:** 
  1. The server (`server.ts`) processes uploads via `multer` but does **not** compress or convert images to WebP/AVIF. It just saves the raw JPEG/PNG.
  2. The `index.html` references raw Unsplash URLs (`https://images.unsplash.com/...`) which can be slow to resolve.
  3. No `<link rel="preload" as="image">` tags are used for critical LCP elements (e.g., the Hero image of a loaded theme).

## 6. React Optimization Report
* **Status:** **MODERATE**
* **Findings:**
  1. Heavy animation libraries (Framer Motion, GSAP) are used globally.
  2. `React.memo` and `useMemo` should be aggressively applied to the `Theme.tsx` components, especially those rendering heavy lists (Gallery, Story).
  3. The `AudioController` is ~38KB and is bundled in a way that loads immediately, rather than deferring until the user clicks "Open Invitation".

## 7. Supabase Optimization Report
* **Status:** **POOR**
* **Findings:**
  1. `server.ts` fetches `/api/themes` directly from Supabase for every request. There is **no in-memory caching** (e.g., node-cache). If 100 users hit the catalog, 100 identical Supabase queries are executed.
  2. The `/api/orders/:orderCode` lacks aggressive caching despite invitation data being mostly static after the customer finalizes the order.

## 8. Recommended Fixes

### Critical Priority
1. **Compress User Uploads:** Integrate `sharp` into `server.ts` to automatically convert all user-uploaded gallery/cover images to WebP and scale them down (e.g., max width 1920px).
2. **Lazy-Load WebGL:** Ensure that the `Points` component and `@react-three/fiber` are completely lazily imported so they do not block the initial page load on the Homepage.
3. **Supabase Caching:** Implement a 5-minute memory cache in `server.ts` for the `/api/themes` endpoint to reduce database reads.

### High Priority
4. **Preload Critical Assets:** Inject `<link rel="preload">` tags for the Hero image and critical Google Fonts dynamically.
5. **Optimize Vendor Chunk:** Extract Framer Motion and Supabase into their own `manualChunks` in `vite.config.ts` to improve caching.

### Medium Priority
6. **Lazy Audio:** Defer loading the `AudioController` chunk until the user interacts with the page.

## 9. Estimated Performance Gains
* **LCP (Largest Contentful Paint):** -1.5s (via Image WebP conversion and preloading).
* **TTI (Time to Interactive):** -2.0s (via deferring the 894KB WebGL chunk and AudioController).
* **Supabase API Latency:** -300ms per request (via memory caching the Theme catalog).
* **Overall Lighthouse Performance Score:** Estimated jump from ~75 to **95+**.
