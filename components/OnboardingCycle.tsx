
import React, { useState } from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { UserProfile } from '../types';

interface Props {
  onNext: (data: Partial<UserProfile>) => void;
}

const OnboardingCycle: React.FC<Props> = ({ onNext }) => {
  const [cycleLength, setCycleLength] = useState(28);
  const [periodDuration, setPeriodDuration] = useState(5);
  const [lastDate, setLastDate] = useState('');

  return (
    <div className="flex flex-col min-h-screen p-8 bg-white justify-center">
      <div className="max-w-xs mx-auto w-full bg-[#FFF5F6] p-8 rounded-[3rem] shadow-xl relative overflow-hidden border border-pink-50">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#FF2D55] opacity-20">
          <div className="w-1/3 h-full bg-[#FF2D55]"></div>
        </div>

        <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2 pt-4">Let's get started</h2>
        <p className="text-[#FF2D55] font-medium mb-10">Tell us a bit about your cycle.</p>

        <div className="space-y-8">
          <div className="space-y-3">
            <label className="block text-sm font-bold text-[#1A1A1A]">Average cycle length</label>
            <div className="relative">
              <input 
                type="number" 
                value={cycleLength}
                onChange={(e) => setCycleLength(Number(e.target.value))}
                className="w-full bg-white border border-pink-200 rounded-2xl py-4 px-6 font-bold text-[#FF2D55]"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-pink-300 font-medium">days</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-[#1A1A1A]">Period duration</label>
            <div className="relative">
              <input 
                type="number" 
                value={periodDuration}
                onChange={(e) => setPeriodDuration(Number(e.target.value))}
                className="w-full bg-white border border-pink-200 rounded-2xl py-4 px-6 font-bold text-[#FF2D55]"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-pink-300 font-medium">days</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-[#1A1A1A]">When did your last period start?</label>
            <div className="relative">
              <input 
                type="date" 
                value={lastDate}
                onChange={(e) => setLastDate(e.target.value)}
                className="w-full bg-white border border-pink-200 rounded-2xl py-4 px-6 font-bold text-[#FF2D55] placeholder:text-pink-100"
              />
              <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 text-pink-300" size={20} />
            </div>
          </div>
        </div>

        <button 
          onClick={() => onNext({ cycleLength, periodDuration, lastPeriodDate: lastDate })}
          disabled={!lastDate}
          className="mt-10 w-full bg-[#FF2D55] text-white rounded-[2rem] py-5 font-bold flex items-center justify-center gap-2 shadow-xl shadow-pink-100 disabled:opacity-50 transition-all hover:scale-[1.02]"
        >
          Next <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default OnboardingCycle;
