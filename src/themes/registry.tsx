import React from 'react';

const Luxury01 = React.lazy(() => import('./Luxury/Luxury01'));
const Luxury02 = React.lazy(() => import('./Luxury/Luxury02'));
const Luxury03 = React.lazy(() => import('./Luxury/Luxury03'));
const Luxury04 = React.lazy(() => import('./Luxury/Luxury04'));
const Floral01 = React.lazy(() => import('./Floral/Floral01'));
const Minimal01 = React.lazy(() => import('./Minimalist/Minimal01'));
const Islamic01 = React.lazy(() => import('./Islamic/Islamic01'));
const Dark01 = React.lazy(() => import('./Dark/Dark01'));
const CinematicTheme = React.lazy(() => import('./CinematicTheme'));
const Luxury05 = React.lazy(() => import('./Luxury/Luxury05'));
const Luxury06 = React.lazy(() => import('./Luxury/Luxury06'));

export type ThemeCategory = 'Elegant' | 'Dark' | 'Minimalist' | 'Islamic' | 'Floral' | 'Rustic' | 'Tropical' | 'Premium';

export interface ThemeMeta {
  id: string;
  name: string;
  category: ThemeCategory;
  price: number;
  thumbnail: string;
  config_json?: any;
  component: React.ComponentType<{ guestName?: string, data?: any }>;
}

export const THEME_REGISTRY: ThemeMeta[] = [
  {
    id: 'luxury01',
    name: 'Royal Palace',
    category: 'Premium',
    price: 350000,
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=300&auto=format&fit=crop&fm=webp',
    component: Luxury01
  },
  {
    id: 'luxury02',
    name: 'Private Quarters',
    category: 'Premium',
    price: 380000,
    thumbnail: 'https://images.unsplash.com/photo-1507504031003-b417219a0fde?q=60&w=300&auto=format&fit=crop&fm=webp',
    component: Luxury02
  },
  {
    id: 'luxury03',
    name: 'Haute Couture',
    category: 'Premium',
    price: 450000,
    thumbnail: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=60&w=300&auto=format&fit=crop&fm=webp',
    component: Luxury03
  },
  {
    id: 'luxury04',
    name: 'The Great Gala',
    category: 'Premium',
    price: 400000,
    thumbnail: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=60&w=300&auto=format&fit=crop&fm=webp',
    component: Luxury04
  },
  {
    id: 'luxury05',
    name: 'Royal Elegance',
    category: 'Premium',
    price: 410000,
    thumbnail: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=60&w=300&auto=format&fit=crop&fm=webp',
    component: Luxury05
  },
  {
    id: 'luxury06',
    name: 'Golden Majesty',
    category: 'Premium',
    price: 425000,
    thumbnail: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=60&w=300&auto=format&fit=crop&fm=webp',
    component: Luxury06
  },
  {
    id: 'floral01',
    name: 'Spring Blossom',
    category: 'Floral',
    price: 150000,
    thumbnail: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=60&w=300&auto=format&fit=crop&fm=webp',
    component: Floral01
  },
  {
    id: 'minimal01',
    name: 'Clean Vanilla',
    category: 'Minimalist',
    price: 120000,
    thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=60&w=300&auto=format&fit=crop&fm=webp',
    component: Minimal01
  },
  {
    id: 'islamic01',
    name: 'Islamic Heritage',
    category: 'Islamic',
    price: 175000,
    thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=60&w=300&auto=format&fit=crop&fm=webp',
    component: Islamic01
  },
  {
    id: 'dark01',
    name: 'Midnight Gold',
    category: 'Dark',
    price: 190000,
    thumbnail: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=60&w=300&auto=format&fit=crop&fm=webp',
    component: Dark01
  },
  {
    id: 'cinematic-theme',
    name: 'Cinematic Story',
    category: 'Elegant',
    price: 150000,
    thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=60&w=300&auto=format&fit=crop&fm=webp',
    component: CinematicTheme
  }
];

export const getThemeById = (id: string) => {
  return THEME_REGISTRY.find(t => t.id === id);
}

export const getThemeComponent = (themeName: string) => {
  // If the user's database has an obsolete theme assigned, safely fallback to Luxury01
  // We can search by id or name
  const theme = THEME_REGISTRY.find(t => t.id === themeName || t.name === themeName);
  if (!theme) {
    console.warn(`Theme ${themeName} is obsolete or not found. Falling back to Luxury01.`);
    return THEME_REGISTRY[0].component; // Luxury01 is at index 0
  }
  return theme.component;
};
