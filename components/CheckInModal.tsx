
import React, { useState } from 'react';
import { X, Droplets, Zap, Utensils, Check } from 'lucide-react';
import { DailyLog, Symptom } from '../types';
import { SYMPTOMS } from '../constants';

interface Props {
  onClose: () => void;
  onSave: (log: DailyLog) => void;
}

const CheckInModal: React.FC<Props> = ({ onClose, onSave }) => {
  const [hasPeriod, setHasPeriod] = useState<boolean | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>([]);
  const [nutrition, setNutrition] = useState('');

  const toggleSymptom = (s: Symptom) => {
    setSelectedSymptoms(prev => prev.includes(s) ? prev.filter(i => i !== s) : [...prev, s]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-[#1A1A1A]/20 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-sm bg-white rounded-[3.5rem] shadow-2xl overflow-hidden p-8 animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-3xl font-bold mb-10 pt-2">Daily Check-in</h2>

        <div className="space-y-10">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Droplets size={16} className="text-[#FF2D55]" />
              <span className="text-[10px] font-bold tracking-widest text-[#FF2D55] uppercase">Cycle Status</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setHasPeriod(true)}
                className={`py-5 rounded-[2rem] font-bold border-2 transition-all ${
                  hasPeriod === true 
                  ? 'bg-[#FF2D55]/5 border-[#FF2D55] text-[#FF2D55]' 
                  : 'bg-white border-pink-100 text-[#1A1A1A]/60'
                }`}
              >
                Period Started
              </button>
              <button 
                onClick={() => setHasPeriod(false)}
                className={`py-5 rounded-[2rem] font-bold border-2 transition-all ${
                  hasPeriod === false 
                  ? 'bg-[#FF2D55]/5 border-[#FF2D55] text-[#FF2D55]' 
                  : 'bg-white border-pink-100 text-[#1A1A1A]/60'
                }`}
              >
                No Period
              </button>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Zap size={16} className="text-[#FF2D55]" />
              <span className="text-[10px] font-bold tracking-widest text-[#FF2D55] uppercase">Hormonal Symptoms</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SYMPTOMS.map(s => (
                <button
                  key={s}
                  onClick={() => toggleSymptom(s as Symptom)}
                  className={`px-6 py-3 rounded-full border-2 text-sm font-bold transition-all ${
                    selectedSymptoms.includes(s as Symptom)
                    ? 'bg-[#FF2D55]/5 border-[#FF2D55] text-[#FF2D55]'
                    : 'bg-white border-pink-100 text-[#1A1A1A]/60'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Utensils size={16} className="text-[#FF2D55]" />
              <span className="text-[10px] font-bold tracking-widest text-[#FF2D55] uppercase">Nutrition Log</span>
            </div>
            <div className="relative">
              <input 
                type="text" 
                value={nutrition}
                onChange={(e) => setNutrition(e.target.value)}
                placeholder="What did you eat today?"
                className="w-full bg-[#FFF5F6] border-none rounded-2xl py-5 px-6 text-[#1A1A1A] placeholder:text-pink-200 focus:ring-2 focus:ring-[#FF2D55] transition-all"
              />
            </div>
            <div className="flex gap-2 mt-3">
              <span className="px-3 py-1 bg-red-50 text-[10px] font-bold text-[#FF2D55] rounded-lg border border-red-100">Suggested: Guava</span>
              <span className="px-3 py-1 bg-red-50 text-[10px] font-bold text-[#FF2D55] rounded-lg border border-red-100">Suggested: Salmon</span>
            </div>
          </section>

          <button 
            onClick={() => onSave({ 
              date: new Date().toISOString(), 
              hasPeriod: hasPeriod || false, 
              symptoms: selectedSymptoms, 
              nutritionNote: nutrition 
            })}
            className="w-full bg-[#FF2D55] text-white rounded-[2.5rem] py-6 font-bold flex items-center justify-center gap-2 shadow-2xl shadow-pink-200 hover:scale-[1.02] transition-transform mt-4"
          >
            <Check size={24} /> Save Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckInModal;
