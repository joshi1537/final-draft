
import React from 'react';
import { Logo } from '../constants';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col min-h-full">
      <header className="p-6 flex justify-between items-center">
        <Logo />
      </header>

      <div className="px-8 mt-12 flex flex-col gap-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-pink-100 w-max shadow-sm">
          <span className="text-[10px] font-bold tracking-widest text-[#FF2D55] uppercase">✨ Reimagining Women's Health</span>
        </div>

        <h1 className="text-6xl font-serif text-[#1A1A1A] leading-[1.1]">
          Understand the <br />
          <span className="text-[#FF2D55] italic">Rhythm</span> of You.
        </h1>

        <p className="text-lg text-gray-500 leading-relaxed font-medium">
          Aura is more than just a tracker. It's a holistic health companion that syncs your diet, exercise, and skincare with your natural hormone cycles.
        </p>

        <div className="mt-8 flex gap-4">
          <button 
            onClick={onStart}
            className="px-10 py-5 bg-[#FF2D55] text-white rounded-full font-bold shadow-xl shadow-pink-200 hover:scale-[1.02] transition-transform"
          >
            Start Today or Log-in
          </button>
        </div>
      </div>

      <div className="mt-12 px-8 relative overflow-hidden">
        <div className="w-full aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative">
          <img 
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=1200&fit=crop"
            alt="Wellness" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
