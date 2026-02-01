
import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { HEALTH_CONDITIONS } from '../constants';

interface Props {
  onNext: (data: { hasPCOS: boolean; hasEndometriosis: boolean }) => void;
}

const OnboardingHealth: React.FC<Props> = ({ onNext }) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="flex flex-col min-h-screen p-8 bg-white justify-center">
      <div className="max-w-xs mx-auto w-full bg-[#FFF5F6] p-8 rounded-[3rem] shadow-xl relative overflow-hidden border border-pink-50">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#FF2D55] opacity-20">
          <div className="w-2/3 h-full bg-[#FF2D55]"></div>
        </div>

        <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2 pt-4">Your Health</h2>
        <p className="text-[#FF2D55] font-medium mb-10">Do you have any underlying conditions?</p>

        <div className="space-y-4">
          {HEALTH_CONDITIONS.map(condition => (
            <button
              key={condition.id}
              onClick={() => toggle(condition.id)}
              className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                selected.includes(condition.id) 
                ? 'bg-[#FF2D55] border-[#FF2D55] text-white' 
                : 'bg-white border-pink-100 text-[#1A1A1A]'
              }`}
            >
              <span className="font-bold">{condition.label}</span>
              {selected.includes(condition.id) && <CheckCircle2 size={20} />}
            </button>
          ))}
          <button
              onClick={() => setSelected([])}
              className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                selected.length === 0 
                ? 'bg-[#FF2D55] border-[#FF2D55] text-white' 
                : 'bg-white border-pink-100 text-[#1A1A1A]'
              }`}
            >
              <span className="font-bold">None</span>
              {selected.length === 0 && <CheckCircle2 size={20} />}
            </button>
        </div>

        <button 
          onClick={() => onNext({ 
            hasPCOS: selected.includes('pcos'), 
            hasEndometriosis: selected.includes('endo') 
          })}
          className="mt-10 w-full bg-[#FF2D55] text-white rounded-[2rem] py-5 font-bold flex items-center justify-center gap-2 shadow-xl shadow-pink-100 transition-all hover:scale-[1.02]"
        >
          Next <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default OnboardingHealth;
