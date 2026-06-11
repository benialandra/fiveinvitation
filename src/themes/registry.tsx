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
import TemaBaru from './TemaBaru';
import SampleMotif28 from './SampleMotif28';
import SampleMotif29 from './SampleMotif29';
import SampleMotif30 from './SampleMotif30';
import SampleMotif31 from './SampleMotif31';
import SampleMotif32 from './SampleMotif32';
import SampleMotif33 from './SampleMotif33';
import SampleMotif35 from './SampleMotif35';
import SampleMotif36 from './SampleMotif36';
import SampleMotif37 from './SampleMotif37';
import SampleMotif38 from './SampleMotif38';
import SampleMotif39 from './SampleMotif39';
import SampleMotif40 from './SampleMotif40';
import SampleMotif41 from './SampleMotif41';
import SampleMotif42 from './SampleMotif42';
import SampleMotif43 from './SampleMotif43';
import SampleMotif44 from './SampleMotif44';
import SampleMotif45 from './SampleMotif45';
import SampleMotif46 from './SampleMotif46';
import SampleMotif47 from './SampleMotif47';
import SampleMotif48 from './SampleMotif48';
import SampleMotif49 from './SampleMotif49';
import SampleMotif50 from './SampleMotif50';
import SampleMotif51 from './SampleMotif51';
import SampleMotif52 from './SampleMotif52';
import SampleMotif53 from './SampleMotif53';
import SampleMotif54 from './SampleMotif54';
import SampleMotif55 from './SampleMotif55';
import SampleMotif56 from './SampleMotif56';
import SampleMotif57 from './SampleMotif57';
import SampleMotif58 from './SampleMotif58';
import SampleMotif59 from './SampleMotif59';
import SampleMotif60 from './SampleMotif60';
import SampleMotif61 from './SampleMotif61';
import SampleMotif62 from './SampleMotif62';
import SampleMotif63 from './SampleMotif63';
import SampleMotif64 from './SampleMotif64';
import SampleMotif65 from './SampleMotif65';
import SampleMotif66 from './SampleMotif66';
import SampleMotif67 from './SampleMotif67';
import SampleMotif68 from './SampleMotif68';
import SampleMotif69 from './SampleMotif69';
import SampleMotif70 from './SampleMotif70';
import CleanVanilla from './CleanVanilla';
import FloralBliss from './FloralBliss';
import SampleMotif7 from './SampleMotif7';
import SampleMotif8 from './SampleMotif8';
import SampleMotif9 from './SampleMotif9';
import SampleMotif10 from './SampleMotif10';
import SampleMotif11 from './SampleMotif11';
import SampleMotif12 from './SampleMotif12';
import SampleMotif13 from './SampleMotif13';
import SampleMotif14 from './SampleMotif14';
import SampleMotif71 from './SampleMotif71';
import SampleMotif15 from './SampleMotif15';
import SampleMotif97 from './SampleMotif97';
import SampleMotif98 from './SampleMotif98';
import SampleMotif99 from './SampleMotif99';
import ClassicWhite from './ClassicWhite';
import SampleMotif72 from './SampleMotif72';
import SampleMotif73 from './SampleMotif73';
import SampleMotif74 from './SampleMotif74';
import SampleMotif75 from './SampleMotif75';
import SampleMotif76 from './SampleMotif76';
import SampleMotif77 from './SampleMotif77';
import SampleMotif78 from './SampleMotif78';
import SampleMotif79 from './SampleMotif79';
import SampleMotif80 from './SampleMotif80';
import SampleMotif81 from './SampleMotif81';
import SampleMotif82 from './SampleMotif82';
import SampleMotif100 from './SampleMotif100';
import SampleMotif83 from './SampleMotif83';
import SampleMotif84 from './SampleMotif84';
import SampleMotif85 from './SampleMotif85';
import SampleMotif86 from './SampleMotif86';
import SampleMotif87 from './SampleMotif87';
import SampleMotif88 from './SampleMotif88';
import SampleMotif89 from './SampleMotif89';
import SampleMotif90 from './SampleMotif90';
import SampleMotif91 from './SampleMotif91';
import SampleMotif92 from './SampleMotif92';
import SampleMotif93 from './SampleMotif93';
import SampleMotif94 from './SampleMotif94';
import SampleMotif95 from './SampleMotif95';
import SampleMotif34 from './SampleMotif34';
import SampleMotif96 from './SampleMotif96';
import IslamicHeritage from './IslamicHeritage';
import SampleMotif16 from './SampleMotif16';
import SampleMotif17 from './SampleMotif17';
import SampleMotif18 from './SampleMotif18';
import SampleMotif19 from './SampleMotif19';
import SampleMotif20 from './SampleMotif20';
import SampleMotif21 from './SampleMotif21';
import SampleMotif22 from './SampleMotif22';
import SampleMotif23 from './SampleMotif23';
import SampleMotif24 from './SampleMotif24';
import SampleMotif25 from './SampleMotif25';
import SampleMotif26 from './SampleMotif26';
import SampleMotif27 from './SampleMotif27';

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
    id: 'mockup-theme-27',
    name: 'Sample Motif 27',
    category: 'Minimalist',
    price: 150000,
    thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif27
  },{
    id: 'mockup-theme-26',
    name: 'Sample Motif 26',
    category: 'Floral',
    price: 150000,
    thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif26
  },{
    id: 'mockup-theme-25',
    name: 'Sample Motif 25',
    category: 'Floral',
    price: 140000,
    thumbnail: 'https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif25
  },{
    id: 'mockup-theme-24',
    name: 'Sample Motif 24',
    category: 'Dark',
    price: 190000,
    thumbnail: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif24
  },{
    id: 'mockup-theme-23',
    name: 'Sample Motif 23',
    category: 'Elegant',
    price: 150000,
    thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif23
  },{
    id: 'mockup-theme-22',
    name: 'Sample Motif 22',
    category: 'Minimalist',
    price: 100000,
    thumbnail: 'https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif22
  },{
    id: 'mockup-theme-21',
    name: 'Sample Motif 21',
    category: 'Dark',
    price: 180000,
    thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif21
  },{
    id: 'mockup-theme-20',
    name: 'Sample Motif 20',
    category: 'Floral',
    price: 140000,
    thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif20
  },{
    id: 'mockup-theme-19',
    name: 'Sample Motif 19',
    category: 'Floral',
    price: 130000,
    thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif19
  },{
    id: 'mockup-theme-18',
    name: 'Sample Motif 18',
    category: 'Elegant',
    price: 100000,
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif18
  },{
    id: 'mockup-theme-17',
    name: 'Sample Motif 17',
    category: 'Minimalist',
    price: 160000,
    thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif17
  },{
    id: 'mockup-theme-16',
    name: 'Sample Motif 16',
    category: 'Floral',
    price: 140000,
    thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif16
  },{
    id: 'islamic-heritage',
    name: 'Islamic Heritage',
    category: 'Islamic',
    price: 175000,
    thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=800&auto=format&fit=crop',
    component: IslamicHeritage
  },{
    id: 'mockup-theme-96',
    name: 'Sample Motif 96',
    category: 'Dark',
    price: 160000,
    thumbnail: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif96
  },{
    id: 'mockup-theme-34',
    name: 'Sample Motif 34',
    category: 'Elegant',
    price: 130000,
    thumbnail: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif34
  },{
    id: 'mockup-theme-95',
    name: 'Sample Motif 95',
    category: 'Minimalist',
    price: 190000,
    thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif95
  },{
    id: 'mockup-theme-94',
    name: 'Sample Motif 94',
    category: 'Elegant',
    price: 160000,
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif94
  },{
    id: 'mockup-theme-93',
    name: 'Sample Motif 93',
    category: 'Elegant',
    price: 160000,
    thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif93
  },{
    id: 'mockup-theme-92',
    name: 'Sample Motif 92',
    category: 'Islamic',
    price: 170000,
    thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif92
  },{
    id: 'mockup-theme-91',
    name: 'Sample Motif 91',
    category: 'Minimalist',
    price: 130000,
    thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif91
  },{
    id: 'mockup-theme-90',
    name: 'Sample Motif 90',
    category: 'Islamic',
    price: 100000,
    thumbnail: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif90
  },{
    id: 'mockup-theme-89',
    name: 'Sample Motif 89',
    category: 'Minimalist',
    price: 100000,
    thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif89
  },{
    id: 'mockup-theme-88',
    name: 'Sample Motif 88',
    category: 'Elegant',
    price: 110000,
    thumbnail: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif88
  },{
    id: 'mockup-theme-87',
    name: 'Sample Motif 87',
    category: 'Dark',
    price: 140000,
    thumbnail: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif87
  },{
    id: 'mockup-theme-86',
    name: 'Sample Motif 86',
    category: 'Elegant',
    price: 150000,
    thumbnail: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif86
  },{
    id: 'mockup-theme-85',
    name: 'Sample Motif 85',
    category: 'Minimalist',
    price: 130000,
    thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif85
  },{
    id: 'mockup-theme-84',
    name: 'Sample Motif 84',
    category: 'Islamic',
    price: 170000,
    thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif84
  },{
    id: 'mockup-theme-83',
    name: 'Sample Motif 83',
    category: 'Floral',
    price: 180000,
    thumbnail: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif83
  },{
    id: 'mockup-theme-100',
    name: 'Sample Motif 100',
    category: 'Floral',
    price: 110000,
    thumbnail: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif100
  },{
    id: 'mockup-theme-82',
    name: 'Sample Motif 82',
    category: 'Floral',
    price: 140000,
    thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif82
  },{
    id: 'mockup-theme-81',
    name: 'Sample Motif 81',
    category: 'Minimalist',
    price: 150000,
    thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif81
  },{
    id: 'mockup-theme-80',
    name: 'Sample Motif 80',
    category: 'Floral',
    price: 190000,
    thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif80
  },{
    id: 'mockup-theme-79',
    name: 'Sample Motif 79',
    category: 'Minimalist',
    price: 170000,
    thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif79
  },{
    id: 'mockup-theme-78',
    name: 'Sample Motif 78',
    category: 'Minimalist',
    price: 150000,
    thumbnail: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif78
  },{
    id: 'mockup-theme-77',
    name: 'Sample Motif 77',
    category: 'Dark',
    price: 130000,
    thumbnail: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif77
  },{
    id: 'mockup-theme-76',
    name: 'Sample Motif 76',
    category: 'Floral',
    price: 120000,
    thumbnail: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif76
  },{
    id: 'mockup-theme-75',
    name: 'Sample Motif 75',
    category: 'Islamic',
    price: 100000,
    thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif75
  },{
    id: 'mockup-theme-74',
    name: 'Sample Motif 74',
    category: 'Dark',
    price: 130000,
    thumbnail: 'https://images.unsplash.com/photo-1507504031003-b417242a901f?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif74
  },{
    id: 'mockup-theme-73',
    name: 'Sample Motif 73',
    category: 'Elegant',
    price: 190000,
    thumbnail: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif73
  },{
    id: 'mockup-theme-72',
    name: 'Sample Motif 72',
    category: 'Islamic',
    price: 160000,
    thumbnail: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif72
  },{
    id: 'classic-white',
    name: 'Classic White',
    category: 'Minimalist',
    price: 110000,
    thumbnail: 'https://elglmntxhbxrysewliqb.supabase.co/storage/v1/object/public/fiveinvitation-bucket/uploads/1780315086220_ChatGPTImageMay28202611_27_01PM.png',
    component: ClassicWhite
  },{
    id: 'mockup-theme-99',
    name: 'Sample Motif 99',
    category: 'Floral',
    price: 150000,
    thumbnail: 'https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif99
  },{
    id: 'mockup-theme-98',
    name: 'Sample Motif 98',
    category: 'Islamic',
    price: 120000,
    thumbnail: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif98
  },{
    id: 'mockup-theme-97',
    name: 'Sample Motif 97',
    category: 'Elegant',
    price: 150000,
    thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif97
  },{
    id: 'mockup-theme-15',
    name: 'Sample Motif 15',
    category: 'Islamic',
    price: 180000,
    thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif15
  },{
    id: 'mockup-theme-71',
    name: 'Sample Motif 71',
    category: 'Minimalist',
    price: 140000,
    thumbnail: 'https://images.unsplash.com/photo-1507504031003-b417242a901f?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif71
  },{
    id: 'mockup-theme-14',
    name: 'Sample Motif 14',
    category: 'Elegant',
    price: 170000,
    thumbnail: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif14
  },{
    id: 'mockup-theme-13',
    name: 'Sample Motif 13',
    category: 'Floral',
    price: 120000,
    thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif13
  },{
    id: 'mockup-theme-12',
    name: 'Sample Motif 12',
    category: 'Minimalist',
    price: 180000,
    thumbnail: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif12
  },{
    id: 'mockup-theme-11',
    name: 'Sample Motif 11',
    category: 'Dark',
    price: 130000,
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif11
  },{
    id: 'mockup-theme-10',
    name: 'Sample Motif 10',
    category: 'Islamic',
    price: 140000,
    thumbnail: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif10
  },{
    id: 'mockup-theme-9',
    name: 'Sample Motif 9',
    category: 'Minimalist',
    price: 140000,
    thumbnail: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif9
  },{
    id: 'mockup-theme-8',
    name: 'Sample Motif 8',
    category: 'Minimalist',
    price: 160000,
    thumbnail: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif8
  },{
    id: 'mockup-theme-7',
    name: 'Sample Motif 7',
    category: 'Islamic',
    price: 120000,
    thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif7
  },{
    id: 'floral-bliss',
    name: 'Floral Bliss',
    category: 'Floral',
    price: 125000,
    thumbnail: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800&auto=format&fit=crop',
    component: FloralBliss
  },{
    id: 'minimalist',
    name: 'Clean Vanilla',
    category: 'Minimalist',
    price: 99000,
    thumbnail: 'https://elglmntxhbxrysewliqb.supabase.co/storage/v1/object/public/fiveinvitation-bucket/uploads/1780461197556_Screenshot2024-11-29205020.png',
    component: CleanVanilla
  },{
    id: 'mockup-theme-70',
    name: 'Sample Motif 70',
    category: 'Elegant',
    price: 170000,
    thumbnail: 'https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif70
  },{
    id: 'mockup-theme-69',
    name: 'Sample Motif 69',
    category: 'Dark',
    price: 120000,
    thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif69
  },{
    id: 'mockup-theme-68',
    name: 'Sample Motif 68',
    category: 'Dark',
    price: 160000,
    thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif68
  },{
    id: 'mockup-theme-67',
    name: 'Sample Motif 67',
    category: 'Dark',
    price: 180000,
    thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif67
  },{
    id: 'mockup-theme-66',
    name: 'Sample Motif 66',
    category: 'Elegant',
    price: 150000,
    thumbnail: 'https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif66
  },{
    id: 'mockup-theme-65',
    name: 'Sample Motif 65',
    category: 'Minimalist',
    price: 160000,
    thumbnail: 'https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif65
  },{
    id: 'mockup-theme-64',
    name: 'Sample Motif 64',
    category: 'Floral',
    price: 120000,
    thumbnail: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif64
  },{
    id: 'mockup-theme-63',
    name: 'Sample Motif 63',
    category: 'Floral',
    price: 110000,
    thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif63
  },{
    id: 'mockup-theme-62',
    name: 'Sample Motif 62',
    category: 'Floral',
    price: 100000,
    thumbnail: 'https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif62
  },{
    id: 'mockup-theme-61',
    name: 'Sample Motif 61',
    category: 'Dark',
    price: 160000,
    thumbnail: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif61
  },{
    id: 'mockup-theme-60',
    name: 'Sample Motif 60',
    category: 'Minimalist',
    price: 140000,
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif60
  },{
    id: 'mockup-theme-59',
    name: 'Sample Motif 59',
    category: 'Islamic',
    price: 150000,
    thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif59
  },{
    id: 'mockup-theme-58',
    name: 'Sample Motif 58',
    category: 'Dark',
    price: 130000,
    thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif58
  },{
    id: 'mockup-theme-57',
    name: 'Sample Motif 57',
    category: 'Minimalist',
    price: 170000,
    thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif57
  },{
    id: 'mockup-theme-56',
    name: 'Sample Motif 56',
    category: 'Dark',
    price: 120000,
    thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif56
  },{
    id: 'mockup-theme-55',
    name: 'Sample Motif 55',
    category: 'Islamic',
    price: 160000,
    thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif55
  },{
    id: 'mockup-theme-54',
    name: 'Sample Motif 54',
    category: 'Floral',
    price: 180000,
    thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif54
  },{
    id: 'mockup-theme-53',
    name: 'Sample Motif 53',
    category: 'Dark',
    price: 150000,
    thumbnail: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif53
  },{
    id: 'mockup-theme-52',
    name: 'Sample Motif 52',
    category: 'Dark',
    price: 160000,
    thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif52
  },{
    id: 'mockup-theme-51',
    name: 'Sample Motif 51',
    category: 'Floral',
    price: 180000,
    thumbnail: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif51
  },{
    id: 'mockup-theme-50',
    name: 'Sample Motif 50',
    category: 'Islamic',
    price: 140000,
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif50
  },{
    id: 'mockup-theme-49',
    name: 'Sample Motif 49',
    category: 'Floral',
    price: 110000,
    thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif49
  },{
    id: 'mockup-theme-48',
    name: 'Sample Motif 48',
    category: 'Floral',
    price: 170000,
    thumbnail: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif48
  },{
    id: 'mockup-theme-47',
    name: 'Sample Motif 47',
    category: 'Minimalist',
    price: 110000,
    thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif47
  },{
    id: 'mockup-theme-46',
    name: 'Sample Motif 46',
    category: 'Floral',
    price: 130000,
    thumbnail: 'https://images.unsplash.com/photo-1507504031003-b417242a901f?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif46
  },{
    id: 'mockup-theme-45',
    name: 'Sample Motif 45',
    category: 'Dark',
    price: 170000,
    thumbnail: 'https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif45
  },{
    id: 'mockup-theme-44',
    name: 'Sample Motif 44',
    category: 'Islamic',
    price: 100000,
    thumbnail: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif44
  },{
    id: 'mockup-theme-43',
    name: 'Sample Motif 43',
    category: 'Islamic',
    price: 140000,
    thumbnail: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif43
  },{
    id: 'mockup-theme-42',
    name: 'Sample Motif 42',
    category: 'Minimalist',
    price: 170000,
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif42
  },{
    id: 'mockup-theme-41',
    name: 'Sample Motif 41',
    category: 'Elegant',
    price: 110000,
    thumbnail: 'https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif41
  },{
    id: 'mockup-theme-40',
    name: 'Sample Motif 40',
    category: 'Minimalist',
    price: 130000,
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif40
  },{
    id: 'mockup-theme-39',
    name: 'Sample Motif 39',
    category: 'Minimalist',
    price: 180000,
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif39
  },{
    id: 'mockup-theme-38',
    name: 'Sample Motif 38',
    category: 'Minimalist',
    price: 170000,
    thumbnail: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif38
  },{
    id: 'mockup-theme-37',
    name: 'Sample Motif 37',
    category: 'Minimalist',
    price: 160000,
    thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif37
  },{
    id: 'mockup-theme-36',
    name: 'Sample Motif 36',
    category: 'Islamic',
    price: 190000,
    thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif36
  },{
    id: 'mockup-theme-35',
    name: 'Sample Motif 35',
    category: 'Floral',
    price: 180000,
    thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif35
  },{
    id: 'mockup-theme-33',
    name: 'Sample Motif 33',
    category: 'Elegant',
    price: 180000,
    thumbnail: 'https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif33
  },{
    id: 'mockup-theme-32',
    name: 'Sample Motif 32',
    category: 'Minimalist',
    price: 160000,
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif32
  },{
    id: 'mockup-theme-31',
    name: 'Sample Motif 31',
    category: 'Floral',
    price: 170000,
    thumbnail: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif31
  },{
    id: 'mockup-theme-30',
    name: 'Sample Motif 30',
    category: 'Floral',
    price: 140000,
    thumbnail: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif30
  },{
    id: 'mockup-theme-29',
    name: 'Sample Motif 29',
    category: 'Dark',
    price: 100000,
    thumbnail: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif29
  },{
    id: 'mockup-theme-28',
    name: 'Sample Motif 28',
    category: 'Minimalist',
    price: 160000,
    thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=300&auto=format&fit=crop',
    component: SampleMotif28
  },{
    id: 'theme-1780248020011',
    name: 'tema baru',
    category: 'Premium',
    price: 150000,
    thumbnail: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000&auto=format&fit=crop',
    component: TemaBaru
  },{
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
