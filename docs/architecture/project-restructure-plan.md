# Project Restructure Plan

## Objective
Propose a highly maintainable, scalable, and deployment-ready folder structure by eliminating dead code, duplicate components, and establishing strict architectural boundaries.

## Phase 4 Findings: Code Smells & Dead Code
During the source structure analysis, the following issues were identified:

1. **Duplicate Theme Components:**
   - There are floating components directly inside `src/themes/` (e.g., `CoupleStory.tsx`, `EventDetails.tsx`, `Gallery.tsx`, `Hero.tsx`, `RSVP.tsx`). These are likely obsolete duplicates of the standardized `src/components/Theme/Shared*.tsx` components.
   - **Action:** Delete the floating components in `src/themes/`.

2. **Dead Theme Folders:**
   - The directory `src/themes/Elegance/` and its `components` subfolder exist, but no `Elegance` themes are registered in `registry.tsx` or exported.
   - **Action:** Completely remove the `Elegance` folder to reduce dead code.

3. **Unused Imports & Registry Bloat:**
   - `src/themes/registry.tsx` imports ~120 themes. Removing 114 of them will massively optimize the Vite build process and remove hundreds of unused imports.

## Phase 5: Proposed Clean Folder Structure

To ensure deployment readiness, the source directory (`src/`) should be strictly organized:

```text
src/
├── components/          # Reusable UI elements
│   ├── Interactive/     # Client-side interactive components (e.g., SmoothScroll)
│   ├── Theme/           # Shared invitation components (SharedHero, PremiumGallery, etc.)
│   │   └── Animations/  # Global animation effects
│   └── Admin/           # Admin dashboard UI components
├── hooks/               # Custom React hooks (e.g., useIntersectionObserver)
├── layouts/             # Page layouts (AdminLayout, PublicLayout)
├── pages/               # Route endpoints (Themes.tsx, Preview.tsx, Admin.tsx, Order.tsx)
├── styles/              # Global CSS (index.css, tailwind base)
├── supabase/            # Database configuration and clients
├── themes/              # Core 6 Invitation Themes ONLY
│   ├── Luxury01.tsx     # Fully decoupled Royal Palace theme
│   ├── Floral01.tsx     # Clean Floral layout
│   ├── Minimal01.tsx    # Clean Minimalist layout
│   ├── Islamic01.tsx    # Clean Islamic layout
│   ├── Dark01.tsx       # Clean Dark mode layout
│   ├── CinematicTheme.tsx
│   └── registry.tsx     # Clean 6-item registry mapping
└── utils/               # Shared helper functions (formatters, parsers)
```

## Benefits of this Restructure
1. **Maintainability:** Developers no longer have to navigate through 120 identical files to find a bug.
2. **Scalability:** The `registry.tsx` becomes easily manageable. If a new aesthetic is requested, a *single* high-quality file is created instead of batch-generating 30.
3. **Deployment Readiness:** Vite bundling times will drop significantly. The bundle size sent to the client router will be drastically reduced, preventing out-of-memory errors on cheap CI/CD runners (like Vercel or Netlify free tiers).
