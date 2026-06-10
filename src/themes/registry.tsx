import React from 'react';
import ElegantGold from './ElegantGold';
import DarkPremium from './DarkPremium';
import RealisticRomance from './RealisticRomance';

import MinimalistMonochrome from './MinimalistMonochrome';
import FloralBlossom from './FloralBlossom';
import GlassmorphismElegance from './GlassmorphismElegance';
import RusticVintage from './RusticVintage';
import OceanBreeze from './OceanBreeze';
import RoyalGoldLuxury from './RoyalGoldLuxury';
import UltraPremiumInteractive from './UltraPremiumInteractive';
import JapaneseSakuraGarden from './JapaneseSakuraGarden';
import CinematicLoveStory from './CinematicLoveStory';
import ScandinavianMinimalist from './ScandinavianMinimalist';
import TropicalBaliWedding from './TropicalBaliWedding';
import IslamicElegant from './IslamicElegant';
import FairytaleCastle from './FairytaleCastle';

export type ThemeCategory = 'Elegant' | 'Dark' | 'Minimalist' | 'Islamic' | 'Floral' | 'Rustic' | 'Tropical' | 'Premium';

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
    id: 'scandinavian-minimalist',
    name: 'Scandinavian Minimalist',
    category: 'Minimalist',
    price: 350000,
    thumbnail: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop',
    component: ScandinavianMinimalist
  },
  {
    id: 'cinematic-love-story',
    name: 'Cinematic Love Story',
    category: 'Premium',
    price: 1500000,
    thumbnail: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800&auto=format&fit=crop',
    component: CinematicLoveStory
  },
  {
    id: 'japanese-sakura-garden',
    name: 'Japanese Sakura Garden',
    category: 'Premium',
    price: 1500000,
    thumbnail: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=800&auto=format&fit=crop',
    component: JapaneseSakuraGarden
  },
  {
    id: 'ultra-premium-interactive',
    name: 'Ultra Premium Interactive',
    category: 'Premium',
    price: 1500000,
    thumbnail: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop',
    component: UltraPremiumInteractive
  },
  {
    id: 'royal-gold-luxury',
    name: 'Royal Gold Luxury',
    category: 'Elegant',
    price: 450000,
    thumbnail: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    component: RoyalGoldLuxury
  },
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
    thumbnail: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop',
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
    id: 'tropical-bali',
    name: 'Tropical Bali Wedding',
    category: 'Tropical',
    price: 349000,
    thumbnail: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop',
    component: TropicalBaliWedding
  },
  {
    id: 'islamic-elegant',
    name: 'Islamic Elegant',
    category: 'Islamic',
    price: 350000,
    thumbnail: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=800&auto=format&fit=crop',
    component: IslamicElegant
  },
  {
    id: 'fairytale-castle',
    name: 'Fairytale Castle',
    category: 'Premium',
    price: 550000,
    thumbnail: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?q=80&w=800&auto=format&fit=crop',
    component: FairytaleCastle
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
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
    component: ElegantGold
  },
  {
    id: 'dark-premium',
    name: 'Midnight Glamour',
    category: 'Dark',
    price: 200000,
    thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
    component: DarkPremium
  }
];

export const getThemeById = (id: string) => {
  return THEME_REGISTRY.find(t => t.id === id);
}
