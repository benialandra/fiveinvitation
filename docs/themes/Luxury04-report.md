# Luxury04 Theme Documentation (The Great Gala)

> [!NOTE]
> This document details the implementation of the `Luxury04` theme, designed exclusively using an *Art Deco Elegance* framework.

## 1. Concept Overview
- **Category:** Luxury
- **Style Name:** The Great Gala (Art Deco)
- **Primary Vibe:** 1920s High Society, Gatsby-esque geometry, bold typography.
- **Differentiator:** Completely abandons the soft minimalism of Luxury01, the dark-royal aesthetic of Luxury02, and the high-fashion editorial of Luxury03. Focuses purely on geometric symmetry, sharp contrasting colors, and stepped animations.

## 2. Technical Implementation
- **File Location:** `src/themes/Luxury/Luxury04.tsx`
- **Component ID:** `luxury04`
- **Registered Name:** The Great Gala
- **Registered Price:** IDR 400.000

## 3. Visual System
### Color Palette
- **Deep Sapphire (`#0A1128`)**: Main background for cover, hero, and RSVP sections.
- **Brushed Brass (`#D4AF37`)**: Primary accent color for borders, lines, and highlighting text.
- **Cream (`#FDFBF7`)**: Primary typography color on dark sections.
- **Obsidian (`#050814`)**: Alternating background for Story, Gallery, and Gift sections to create depth.

### Typography
- **Headings:** `font-serif` mapped to geometric serif styling.
- **Body:** `font-sans` with `tracking-widest` and `uppercase` for metadata to give a vintage ticket feel.

### Animations
- **Stepped Elevate:** AnimatePresence and Framer Motion are used to trigger elements in a staggered fashion using `useIntersectionObserver`. Elements rise from `y: 40` with geometric easing `[0.25, 0.1, 0.25, 1.0]`.

## 4. Quality Assurance
- **Cross-Browser Verification:** Playwright script (`scripts/capture_luxury04.cjs`) executed successfully across iPhone SE, iPhone 12, iPhone 14 Pro Max, and Galaxy A54.
- **Zero Console Errors:** Hook destructing (`useIntersectionObserver`) and fallback data binding issues successfully resolved during staging.
- **Build Production:** Successfully minified via `vite build` into a 14.60 kB JS chunk without breaking React dependency trees.

## 5. Supabase Synchronization
- Theme automatically upserted into the `themes` table via Node script with unique identifier `luxury04`.

***End of Report***
