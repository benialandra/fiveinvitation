import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { THEME_REGISTRY } from '../themes/registry';
import { ArrowLeft } from 'lucide-react';

export default function Preview() {
  const { themeId } = useParams();
  const theme = THEME_REGISTRY.find(t => t.id === themeId);

  if (!theme) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900">
        <h1 className="text-2xl font-bold mb-4">Tema tidak ditemukan</h1>
        <Link to="/themes" className="px-4 py-2 bg-black text-white rounded-full">Kembali ke Katalog</Link>
      </div>
    );
  }

  const ThemeComponent = theme.component;

  // We should pass sample data to the theme
  const sampleProps = {
    groom: "Beni",
    bride: "Salsa",
    date: new Date("2026-12-12T09:00:00").toISOString(),
    location: "Hotel Mulia, Jakarta",
    quotes: "And among His signs is this, that He created for you mates from among yourselves...",
  };

  return (
    <div className="w-full relative">
      <div className="fixed top-4 left-4 z-[100]">
        <Link 
          to="/themes" 
          className="flex items-center gap-2 px-4 py-2 bg-black/50 hover:bg-black backdrop-blur text-white text-xs uppercase tracking-widest font-semibold rounded-full transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali
        </Link>
      </div>
      <ThemeComponent {...sampleProps} />
    </div>
  );
}
