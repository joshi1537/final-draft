
import React, { useState } from 'react';
import { ArrowRight, Apple, CheckCircle2 } from 'lucide-react';
import { DIETARY_OPTIONS } from '../constants';

interface Props {
  onNext: (diet: string[]) => void;
}

const OnboardingDiet: React.FC<Props> = ({ onNext }) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (item: string) => {
    if (item === 'None') {
      setSelected(['None']);
    } else {
      setSelected(prev => {
        const next = prev.filter(i => i !== 'None');
        return next.includes(item) ? next.filter(i => i !== item) : [...next, item];
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-8 bg-white justify-center">
      <div className="max-w-xs mx-auto w-full bg-[#FFF5F6] p-8 rounded-[3rem] shadow-xl relative overflow-hidden border border-pink-50">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#FF2D55] opacity-20">
          <div className="w-full h-full bg-[#FF2D55]"></div>
        </div>

        <div className="flex justify-center mb-6">
          <div className="p-4 bg-white rounded-3xl shadow-lg border border-pink-50">
            <Apple className="text-[#FF2D55]" size={32} />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2 pt-4">Nourishment</h2>
        <p className="text-[#FF2D55] font-medium mb-10">Any dietary restrictions or preferences?</p>

        <div className="grid grid-cols-1 gap-3 max-h-[40vh] overflow-y-auto pr-2">
          {DIETARY_OPTIONS.map(option => (
            <button
              key={option}
              onClick={() => toggle(option)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                selected.includes(option) 
                ? 'bg-[#FF2D55] border-[#FF2D55] text-white' 
                : 'bg-white border-pink-100 text-[#1A1A1A]'
              }`}
            >
              <span className="font-bold text-sm">{option}</span>
              {selected.includes(option) && <CheckCircle2 size={16} />}
            </button>
          ))}
        </div>

        <button 
          onClick={() => onNext(selected)}
          disabled={selected.length === 0}
          className="mt-10 w-full bg-[#FF2D55] text-white rounded-[2rem] py-5 font-bold flex items-center justify-center gap-2 shadow-xl shadow-pink-100 disabled:opacity-50 transition-all hover:scale-[1.02]"
        >
          Let's Begin <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default OnboardingDiet;
