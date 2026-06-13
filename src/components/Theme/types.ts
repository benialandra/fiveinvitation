export interface ThemeData {
  groom_name?: string;
  bride_name?: string;
  groom_parents?: string;
  bride_parents?: string;
  akad_date?: string;
  resepsi_date?: string;
  location_name?: string;
  maps_link?: string;
  cover_image?: string;
  hero_image?: string;
  groom_image?: string;
  bride_image?: string;
  gallery_1?: string;
  gallery_2?: string;
  gallery_3?: string;
  gallery_4?: string;
  [key: string]: any; // Allow extension
}

export interface BaseSectionProps {
  data: ThemeData;
  lang?: 'en' | 'id';
  className?: string;
  variants?: any; // Framer motion variants
}
