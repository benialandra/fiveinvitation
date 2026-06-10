import React from 'react';
import ElegantGold from './ElegantGold';
import DarkPremium from './DarkPremium';
import RealisticRomance from './RealisticRomance';

import MinimalistMonochrome from './MinimalistMonochrome';
import FloralBlossom from './FloralBlossom';
import GlassmorphismElegance from './GlassmorphismElegance';
import RusticVintage from './RusticVintage';
import OceanBreeze from './OceanBreeze';

export type ThemeCategory = 'Elegant' | 'Dark' | 'Minimalist' | 'Islamic' | 'Floral' | 'Rustic' | 'Tropical';

export interface ThemeMeta {
  id: string;
  name: string;
  category: ThemeCategory;
  price: number;
  thumbnail: string;
  component: React.ComponentType<{ guestName?: string, data?: any }>;
}

export const THEME_REGISTRY: ThemeMeta[] = [
  {
    id: 'glassmorphism-elegance',
    name: 'Glassmorphism Elegance',
    category: 'Elegant',
    price: 399000,
    thumbnail: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop',
    component: GlassmorphismElegance
  },
  {
    id: 'rustic-vintage',
    name: 'Rustic Vintage',
    category: 'Rustic',
    price: 299000,
    thumbnail: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800&auto=format&fit=crop',
    component: RusticVintage
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    category: 'Tropical',
    price: 349000,
    thumbnail: 'https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=80&w=800&auto=format&fit=crop',
    component: OceanBreeze
  },
  {
    id: 'floral-blossom',
    name: 'Floral Blossom',
    category: 'Floral',
    price: 180000,
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
    component: FloralBlossom
  },
  {
    id: 'minimalist-monochrome',
    name: 'Monochrome Minimalist',
    category: 'Minimalist',
    price: 180000,
    thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop',
    component: MinimalistMonochrome
  },
  {
    id: 'realistic-romance',
    name: 'Realistic Romance',
    category: 'Elegant',
    price: 350000,
    thumbnail: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    component: RealisticRomance
  },
  {
    id: 'elegant-gold',
    name: 'Elegant Gold V1',
    category: 'Elegant',
    price: 150000,
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop', // Stock placeholder
    component: ElegantGold
  },
  {
    id: 'dark-premium',
    name: 'Midnight Glamour',
    category: 'Dark',
    price: 200000,
    thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop', // Stock placeholder
    component: DarkPremium
  },
  {
    id: 'minimalist',
    name: 'Clean Vanilla',
    category: 'Minimalist',
    price: 99000,
    thumbnail: 'https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=80&w=800&auto=format&fit=crop', // Stock placeholder
    component: () => <div className="min-h-screen flex items-center justify-center bg-[#fafafa] text-gray-800">Theme Minimalist (Sample)</div>
  },
  {
    id: 'floral-bliss',
    name: 'Floral Bliss',
    category: 'Floral',
    price: 125000,
    thumbnail: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800&auto=format&fit=crop', 
    component: () => <div className="min-h-screen flex items-center justify-center bg-rose-50 text-rose-900">Theme Floral (Sample)</div>
  },
  {
    id: 'islamic-heritage',
    name: 'Islamic Heritage',
    category: 'Islamic',
    price: 175000,
    thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=800&auto=format&fit=crop', 
    component: () => <div className="min-h-screen flex items-center justify-center bg-emerald-900 text-emerald-50">Theme Islamic (Sample)</div>
  },
  {
    id: 'classic-white',
    name: 'Classic White',
    category: 'Minimalist',
    price: 110000,
    thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop', 
    component: () => <div className="min-h-screen flex items-center justify-center bg-white text-gray-900">Theme Classic White (Sample)</div>
  }
  ,
  {
    id: 'mockup-theme-7',
    name: 'Sample Motif 7',
    category: 'Islamic',
    price: 120000,
    thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 7 (Sample)</div>
  },
  {
    id: 'mockup-theme-8',
    name: 'Sample Motif 8',
    category: 'Minimalist',
    price: 160000,
    thumbnail: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 8 (Sample)</div>
  },
  {
    id: 'mockup-theme-9',
    name: 'Sample Motif 9',
    category: 'Minimalist',
    price: 140000,
    thumbnail: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 9 (Sample)</div>
  },
  {
    id: 'mockup-theme-10',
    name: 'Sample Motif 10',
    category: 'Islamic',
    price: 140000,
    thumbnail: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 10 (Sample)</div>
  },
  {
    id: 'mockup-theme-11',
    name: 'Sample Motif 11',
    category: 'Dark',
    price: 130000,
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 11 (Sample)</div>
  },
  {
    id: 'mockup-theme-12',
    name: 'Sample Motif 12',
    category: 'Minimalist',
    price: 180000,
    thumbnail: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 12 (Sample)</div>
  },
  {
    id: 'mockup-theme-13',
    name: 'Sample Motif 13',
    category: 'Floral',
    price: 120000,
    thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 13 (Sample)</div>
  },
  {
    id: 'mockup-theme-14',
    name: 'Sample Motif 14',
    category: 'Elegant',
    price: 170000,
    thumbnail: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 14 (Sample)</div>
  },
  {
    id: 'mockup-theme-15',
    name: 'Sample Motif 15',
    category: 'Islamic',
    price: 180000,
    thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 15 (Sample)</div>
  },
  {
    id: 'mockup-theme-16',
    name: 'Sample Motif 16',
    category: 'Floral',
    price: 140000,
    thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 16 (Sample)</div>
  },
  {
    id: 'mockup-theme-17',
    name: 'Sample Motif 17',
    category: 'Minimalist',
    price: 160000,
    thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 17 (Sample)</div>
  },
  {
    id: 'mockup-theme-18',
    name: 'Sample Motif 18',
    category: 'Elegant',
    price: 100000,
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 18 (Sample)</div>
  },
  {
    id: 'mockup-theme-19',
    name: 'Sample Motif 19',
    category: 'Floral',
    price: 130000,
    thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 19 (Sample)</div>
  },
  {
    id: 'mockup-theme-20',
    name: 'Sample Motif 20',
    category: 'Floral',
    price: 140000,
    thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 20 (Sample)</div>
  },
  {
    id: 'mockup-theme-21',
    name: 'Sample Motif 21',
    category: 'Dark',
    price: 180000,
    thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 21 (Sample)</div>
  },
  {
    id: 'mockup-theme-22',
    name: 'Sample Motif 22',
    category: 'Minimalist',
    price: 100000,
    thumbnail: 'https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 22 (Sample)</div>
  },
  {
    id: 'mockup-theme-23',
    name: 'Sample Motif 23',
    category: 'Elegant',
    price: 150000,
    thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 23 (Sample)</div>
  },
  {
    id: 'mockup-theme-24',
    name: 'Sample Motif 24',
    category: 'Dark',
    price: 190000,
    thumbnail: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 24 (Sample)</div>
  },
  {
    id: 'mockup-theme-25',
    name: 'Sample Motif 25',
    category: 'Floral',
    price: 140000,
    thumbnail: 'https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 25 (Sample)</div>
  },
  {
    id: 'mockup-theme-26',
    name: 'Sample Motif 26',
    category: 'Floral',
    price: 150000,
    thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 26 (Sample)</div>
  },
  {
    id: 'mockup-theme-27',
    name: 'Sample Motif 27',
    category: 'Minimalist',
    price: 150000,
    thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 27 (Sample)</div>
  },
  {
    id: 'mockup-theme-28',
    name: 'Sample Motif 28',
    category: 'Minimalist',
    price: 160000,
    thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 28 (Sample)</div>
  },
  {
    id: 'mockup-theme-29',
    name: 'Sample Motif 29',
    category: 'Dark',
    price: 100000,
    thumbnail: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 29 (Sample)</div>
  },
  {
    id: 'mockup-theme-30',
    name: 'Sample Motif 30',
    category: 'Floral',
    price: 140000,
    thumbnail: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 30 (Sample)</div>
  },
  {
    id: 'mockup-theme-31',
    name: 'Sample Motif 31',
    category: 'Floral',
    price: 170000,
    thumbnail: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 31 (Sample)</div>
  },
  {
    id: 'mockup-theme-32',
    name: 'Sample Motif 32',
    category: 'Minimalist',
    price: 160000,
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 32 (Sample)</div>
  },
  {
    id: 'mockup-theme-33',
    name: 'Sample Motif 33',
    category: 'Elegant',
    price: 180000,
    thumbnail: 'https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 33 (Sample)</div>
  },
  {
    id: 'mockup-theme-34',
    name: 'Sample Motif 34',
    category: 'Elegant',
    price: 130000,
    thumbnail: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 34 (Sample)</div>
  },
  {
    id: 'mockup-theme-35',
    name: 'Sample Motif 35',
    category: 'Floral',
    price: 180000,
    thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 35 (Sample)</div>
  },
  {
    id: 'mockup-theme-36',
    name: 'Sample Motif 36',
    category: 'Islamic',
    price: 190000,
    thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 36 (Sample)</div>
  },
  {
    id: 'mockup-theme-37',
    name: 'Sample Motif 37',
    category: 'Minimalist',
    price: 160000,
    thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 37 (Sample)</div>
  },
  {
    id: 'mockup-theme-38',
    name: 'Sample Motif 38',
    category: 'Minimalist',
    price: 170000,
    thumbnail: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 38 (Sample)</div>
  },
  {
    id: 'mockup-theme-39',
    name: 'Sample Motif 39',
    category: 'Minimalist',
    price: 180000,
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 39 (Sample)</div>
  },
  {
    id: 'mockup-theme-40',
    name: 'Sample Motif 40',
    category: 'Minimalist',
    price: 130000,
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 40 (Sample)</div>
  },
  {
    id: 'mockup-theme-41',
    name: 'Sample Motif 41',
    category: 'Elegant',
    price: 110000,
    thumbnail: 'https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 41 (Sample)</div>
  },
  {
    id: 'mockup-theme-42',
    name: 'Sample Motif 42',
    category: 'Minimalist',
    price: 170000,
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 42 (Sample)</div>
  },
  {
    id: 'mockup-theme-43',
    name: 'Sample Motif 43',
    category: 'Islamic',
    price: 140000,
    thumbnail: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 43 (Sample)</div>
  },
  {
    id: 'mockup-theme-44',
    name: 'Sample Motif 44',
    category: 'Islamic',
    price: 100000,
    thumbnail: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 44 (Sample)</div>
  },
  {
    id: 'mockup-theme-45',
    name: 'Sample Motif 45',
    category: 'Dark',
    price: 170000,
    thumbnail: 'https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 45 (Sample)</div>
  },
  {
    id: 'mockup-theme-46',
    name: 'Sample Motif 46',
    category: 'Floral',
    price: 130000,
    thumbnail: 'https://images.unsplash.com/photo-1507504031003-b417242a901f?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 46 (Sample)</div>
  },
  {
    id: 'mockup-theme-47',
    name: 'Sample Motif 47',
    category: 'Minimalist',
    price: 110000,
    thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 47 (Sample)</div>
  },
  {
    id: 'mockup-theme-48',
    name: 'Sample Motif 48',
    category: 'Floral',
    price: 170000,
    thumbnail: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 48 (Sample)</div>
  },
  {
    id: 'mockup-theme-49',
    name: 'Sample Motif 49',
    category: 'Floral',
    price: 110000,
    thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 49 (Sample)</div>
  },
  {
    id: 'mockup-theme-50',
    name: 'Sample Motif 50',
    category: 'Islamic',
    price: 140000,
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 50 (Sample)</div>
  },
  {
    id: 'mockup-theme-51',
    name: 'Sample Motif 51',
    category: 'Floral',
    price: 180000,
    thumbnail: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 51 (Sample)</div>
  },
  {
    id: 'mockup-theme-52',
    name: 'Sample Motif 52',
    category: 'Dark',
    price: 160000,
    thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 52 (Sample)</div>
  },
  {
    id: 'mockup-theme-53',
    name: 'Sample Motif 53',
    category: 'Dark',
    price: 150000,
    thumbnail: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 53 (Sample)</div>
  },
  {
    id: 'mockup-theme-54',
    name: 'Sample Motif 54',
    category: 'Floral',
    price: 180000,
    thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 54 (Sample)</div>
  },
  {
    id: 'mockup-theme-55',
    name: 'Sample Motif 55',
    category: 'Islamic',
    price: 160000,
    thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 55 (Sample)</div>
  },
  {
    id: 'mockup-theme-56',
    name: 'Sample Motif 56',
    category: 'Dark',
    price: 120000,
    thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 56 (Sample)</div>
  },
  {
    id: 'mockup-theme-57',
    name: 'Sample Motif 57',
    category: 'Minimalist',
    price: 170000,
    thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 57 (Sample)</div>
  },
  {
    id: 'mockup-theme-58',
    name: 'Sample Motif 58',
    category: 'Dark',
    price: 130000,
    thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 58 (Sample)</div>
  },
  {
    id: 'mockup-theme-59',
    name: 'Sample Motif 59',
    category: 'Islamic',
    price: 150000,
    thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 59 (Sample)</div>
  },
  {
    id: 'mockup-theme-60',
    name: 'Sample Motif 60',
    category: 'Minimalist',
    price: 140000,
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 60 (Sample)</div>
  },
  {
    id: 'mockup-theme-61',
    name: 'Sample Motif 61',
    category: 'Dark',
    price: 160000,
    thumbnail: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 61 (Sample)</div>
  },
  {
    id: 'mockup-theme-62',
    name: 'Sample Motif 62',
    category: 'Floral',
    price: 100000,
    thumbnail: 'https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 62 (Sample)</div>
  },
  {
    id: 'mockup-theme-63',
    name: 'Sample Motif 63',
    category: 'Floral',
    price: 110000,
    thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 63 (Sample)</div>
  },
  {
    id: 'mockup-theme-64',
    name: 'Sample Motif 64',
    category: 'Floral',
    price: 120000,
    thumbnail: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 64 (Sample)</div>
  },
  {
    id: 'mockup-theme-65',
    name: 'Sample Motif 65',
    category: 'Minimalist',
    price: 160000,
    thumbnail: 'https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 65 (Sample)</div>
  },
  {
    id: 'mockup-theme-66',
    name: 'Sample Motif 66',
    category: 'Elegant',
    price: 150000,
    thumbnail: 'https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 66 (Sample)</div>
  },
  {
    id: 'mockup-theme-67',
    name: 'Sample Motif 67',
    category: 'Dark',
    price: 180000,
    thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 67 (Sample)</div>
  },
  {
    id: 'mockup-theme-68',
    name: 'Sample Motif 68',
    category: 'Dark',
    price: 160000,
    thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 68 (Sample)</div>
  },
  {
    id: 'mockup-theme-69',
    name: 'Sample Motif 69',
    category: 'Dark',
    price: 120000,
    thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 69 (Sample)</div>
  },
  {
    id: 'mockup-theme-70',
    name: 'Sample Motif 70',
    category: 'Elegant',
    price: 170000,
    thumbnail: 'https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 70 (Sample)</div>
  },
  {
    id: 'mockup-theme-71',
    name: 'Sample Motif 71',
    category: 'Minimalist',
    price: 140000,
    thumbnail: 'https://images.unsplash.com/photo-1507504031003-b417242a901f?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 71 (Sample)</div>
  },
  {
    id: 'mockup-theme-72',
    name: 'Sample Motif 72',
    category: 'Islamic',
    price: 160000,
    thumbnail: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 72 (Sample)</div>
  },
  {
    id: 'mockup-theme-73',
    name: 'Sample Motif 73',
    category: 'Elegant',
    price: 190000,
    thumbnail: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 73 (Sample)</div>
  },
  {
    id: 'mockup-theme-74',
    name: 'Sample Motif 74',
    category: 'Dark',
    price: 130000,
    thumbnail: 'https://images.unsplash.com/photo-1507504031003-b417242a901f?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 74 (Sample)</div>
  },
  {
    id: 'mockup-theme-75',
    name: 'Sample Motif 75',
    category: 'Islamic',
    price: 100000,
    thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 75 (Sample)</div>
  },
  {
    id: 'mockup-theme-76',
    name: 'Sample Motif 76',
    category: 'Floral',
    price: 120000,
    thumbnail: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 76 (Sample)</div>
  },
  {
    id: 'mockup-theme-77',
    name: 'Sample Motif 77',
    category: 'Dark',
    price: 130000,
    thumbnail: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 77 (Sample)</div>
  },
  {
    id: 'mockup-theme-78',
    name: 'Sample Motif 78',
    category: 'Minimalist',
    price: 150000,
    thumbnail: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 78 (Sample)</div>
  },
  {
    id: 'mockup-theme-79',
    name: 'Sample Motif 79',
    category: 'Minimalist',
    price: 170000,
    thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 79 (Sample)</div>
  },
  {
    id: 'mockup-theme-80',
    name: 'Sample Motif 80',
    category: 'Floral',
    price: 190000,
    thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 80 (Sample)</div>
  },
  {
    id: 'mockup-theme-81',
    name: 'Sample Motif 81',
    category: 'Minimalist',
    price: 150000,
    thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 81 (Sample)</div>
  },
  {
    id: 'mockup-theme-82',
    name: 'Sample Motif 82',
    category: 'Floral',
    price: 140000,
    thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 82 (Sample)</div>
  },
  {
    id: 'mockup-theme-83',
    name: 'Sample Motif 83',
    category: 'Floral',
    price: 180000,
    thumbnail: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 83 (Sample)</div>
  },
  {
    id: 'mockup-theme-84',
    name: 'Sample Motif 84',
    category: 'Islamic',
    price: 170000,
    thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 84 (Sample)</div>
  },
  {
    id: 'mockup-theme-85',
    name: 'Sample Motif 85',
    category: 'Minimalist',
    price: 130000,
    thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 85 (Sample)</div>
  },
  {
    id: 'mockup-theme-86',
    name: 'Sample Motif 86',
    category: 'Elegant',
    price: 150000,
    thumbnail: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 86 (Sample)</div>
  },
  {
    id: 'mockup-theme-87',
    name: 'Sample Motif 87',
    category: 'Dark',
    price: 140000,
    thumbnail: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 87 (Sample)</div>
  },
  {
    id: 'mockup-theme-88',
    name: 'Sample Motif 88',
    category: 'Elegant',
    price: 110000,
    thumbnail: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 88 (Sample)</div>
  },
  {
    id: 'mockup-theme-89',
    name: 'Sample Motif 89',
    category: 'Minimalist',
    price: 100000,
    thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 89 (Sample)</div>
  },
  {
    id: 'mockup-theme-90',
    name: 'Sample Motif 90',
    category: 'Islamic',
    price: 100000,
    thumbnail: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 90 (Sample)</div>
  },
  {
    id: 'mockup-theme-91',
    name: 'Sample Motif 91',
    category: 'Minimalist',
    price: 130000,
    thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 91 (Sample)</div>
  },
  {
    id: 'mockup-theme-92',
    name: 'Sample Motif 92',
    category: 'Islamic',
    price: 170000,
    thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 92 (Sample)</div>
  },
  {
    id: 'mockup-theme-93',
    name: 'Sample Motif 93',
    category: 'Elegant',
    price: 160000,
    thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 93 (Sample)</div>
  },
  {
    id: 'mockup-theme-94',
    name: 'Sample Motif 94',
    category: 'Elegant',
    price: 160000,
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 94 (Sample)</div>
  },
  {
    id: 'mockup-theme-95',
    name: 'Sample Motif 95',
    category: 'Minimalist',
    price: 190000,
    thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 95 (Sample)</div>
  },
  {
    id: 'mockup-theme-96',
    name: 'Sample Motif 96',
    category: 'Dark',
    price: 160000,
    thumbnail: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 96 (Sample)</div>
  },
  {
    id: 'mockup-theme-97',
    name: 'Sample Motif 97',
    category: 'Elegant',
    price: 150000,
    thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 97 (Sample)</div>
  },
  {
    id: 'mockup-theme-98',
    name: 'Sample Motif 98',
    category: 'Islamic',
    price: 120000,
    thumbnail: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 98 (Sample)</div>
  },
  {
    id: 'mockup-theme-99',
    name: 'Sample Motif 99',
    category: 'Floral',
    price: 150000,
    thumbnail: 'https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 99 (Sample)</div>
  },
  {
    id: 'mockup-theme-100',
    name: 'Sample Motif 100',
    category: 'Floral',
    price: 110000,
    thumbnail: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=300&auto=format&fit=crop',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme 100 (Sample)</div>
  }
];

export const getThemeById = (id: string) => {
  return THEME_REGISTRY.find(t => t.id === id);
}
