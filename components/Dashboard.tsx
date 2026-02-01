
import React, { useState } from 'react';
import { Bell, MessageCircle, Star, Flame, Droplets, Loader2, X, Info, ChevronRight } from 'lucide-react';
import { UserProfile, CycleInsights } from '../types';
import { Logo } from '../constants';

interface Props {
  user: UserProfile;
  insights: CycleInsights | null;
  loading: boolean;
}

const Dashboard: React.FC<Props> = ({ user, insights, loading }) => {
  const [activeModal, setActiveModal] = useState<'nutrition' | 'workout' | null>(null);

  if (loading || !insights) {
    return (
      <div className="flex flex-col min-h-full bg-white">
        <header className="px-6 py-8 flex justify-between items-center">
          <Logo size={20} />
          <div className="w-10 h-10 rounded-full bg-pink-50 animate-pulse"></div>
        </header>
        <div className="p-10 flex flex-col items-center justify-center space-y-4 text-center mt-20">
          <div className="relative">
             <div className="w-20 h-20 border-4 border-pink-100 border-t-[#FF2D55] rounded-full animate-spin"></div>
             <Droplets className="absolute inset-0 m-auto text-[#FF2D55]" size={32} />
          </div>
          <h2 className="text-2xl font-serif text-[#FF2D55] italic">Decoding your hormones...</h2>
          <p className="text-gray-400 max-w-xs font-medium">Aura is syncing with your biological clock.</p>
        </div>
      </div>
    );
  }

  // Stable images based on phase keywords
  const phaseImages: Record<string, string> = {
    'menstrual-rest': 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80', // Spa/tea
    'follicular-energy': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80', // Fresh salad/energy
    'ovulatory-bloom': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80', // Yoga/outdoor
    'luteal-slow': 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&w=800&q=80', // Reading/indoor
  };

  const displayImage = phaseImages[insights.phaseImageKey] || phaseImages['menstrual-rest'];

  const DetailModal = ({ type }: { type: 'nutrition' | 'workout' }) => {
    const isNutr = type === 'nutrition';
    const focus = isNutr ? insights.nutritionFocus : insights.workoutFocus;
    const items = isNutr ? insights.nutritionItems : insights.workoutItems;
    const why = isNutr ? insights.nutritionWhy : insights.workoutWhy;
    const icon = isNutr ? <Droplets className="text-[#FF2D55]" /> : <Flame className="text-[#FF2D55]" />;

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setActiveModal(null)}></div>
        <div className="relative bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
          <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full text-gray-400">
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-pink-50 rounded-[1.5rem]">{icon}</div>
            <div>
              <p className="text-[10px] font-black tracking-widest text-[#FF2D55] uppercase">Deep Dive</p>
              <h3 className="text-2xl font-bold">{isNutr ? 'Nutrition Guide' : 'Movement Plan'}</h3>
            </div>
          </div>

          <div className="space-y-8">
            <div className="p-6 bg-[#FFF5F6] rounded-[2rem] border border-pink-100">
              <div className="flex items-center gap-2 mb-3">
                <Info size={16} className="text-[#FF2D55]" />
                <p className="text-xs font-bold text-[#FF2D55] uppercase tracking-wider">The "Why"</p>
              </div>
              <p className="text-sm font-medium text-gray-700 leading-relaxed italic">
                "{why}"
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Recommended for {insights.currentPhase}</p>
              <div className="grid grid-cols-1 gap-3">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 bg-white border border-pink-50 rounded-2xl shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-[#FF2D55]"></div>
                    <span className="font-bold text-gray-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={() => setActiveModal(null)}
            className="w-full mt-10 bg-[#FF2D55] text-white py-5 rounded-[2rem] font-bold shadow-xl shadow-pink-200"
          >
            Got it, Aura
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-full bg-[#FFF5F6]">
      {activeModal && <DetailModal type={activeModal} />}

      <header className="px-6 py-8 flex justify-between items-center bg-white sticky top-0 z-10 border-b border-pink-50">
        <Logo size={20} />
        <div className="flex gap-4">
         
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF2D55] to-pink-400 flex items-center justify-center font-bold text-white shadow-lg shadow-pink-100 uppercase">
            {user.email[0]}
          </div>
        </div>
      </header>

      <div className="p-6 space-y-8">
        {/* Cycle Overview */}
        <div className="bg-[#FF2D55] rounded-[3.5rem] p-8 text-white shadow-2xl shadow-pink-200 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="flex justify-between items-start mb-6">
            <div className="px-5 py-2 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black tracking-widest uppercase border border-white/20">
              {insights.currentPhase} • Day {insights.cycleDay}
            </div>
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
              <Droplets size={24} />
            </div>
          </div>

          <h2 className="text-5xl font-serif mb-4 italic tracking-tight">{insights.phaseTitle}</h2>
          <p className="text-white/90 font-medium text-lg leading-relaxed mb-10 pr-4">
            {insights.phaseDescription}
          </p>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/15 backdrop-blur-md p-4 rounded-3xl text-center border border-white/10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">Fertility</p>
              <p className="font-bold text-sm">{insights.fertilityStatus}</p>
            </div>
            <div className="bg-white/15 backdrop-blur-md p-4 rounded-3xl text-center border border-white/10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">Next Cycle</p>
              <p className="font-bold text-sm">{insights.daysUntilNextPeriod}d</p>
            </div>
            <div className="bg-white/15 backdrop-blur-md p-4 rounded-3xl text-center border border-white/10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">Workout</p>
              <p className="font-bold text-sm truncate uppercase">{insights.workoutFocus.split(' ')[0]}</p>
            </div>
          </div>
        </div>

        {/* Nutrition List Card */}
        <div 
          onClick={() => setActiveModal('nutrition')}
          className="bg-white rounded-[3rem] overflow-hidden border border-pink-50 shadow-xl group cursor-pointer"
        >
          <div className="p-6 flex items-center justify-between border-b border-pink-50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#FFF5F6] rounded-xl text-[#FF2D55]">
                <Droplets size={18} />
              </div>
              <h3 className="font-black text-gray-400 uppercase tracking-widest text-[10px]">Daily Nutrition Focus</h3>
            </div>
            <div className="p-2 bg-pink-50 rounded-lg text-[#FF2D55] group-hover:bg-[#FF2D55] group-hover:text-white transition-colors">
              <ChevronRight size={16} />
            </div>
          </div>
          <div className="p-8">
            <div className="mb-6">
              <h4 className="text-3xl font-serif italic text-[#1A1A1A] mb-2">{insights.nutritionFocus}</h4>
              <p className="text-gray-400 font-medium text-sm leading-relaxed">
                Focus on these foods to support {insights.currentPhase.toLowerCase()} hormone levels.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {insights.nutritionItems.map(item => (
                <span key={item} className="px-5 py-2.5 bg-[#FFF5F6] text-[#FF2D55] text-xs font-bold rounded-full border border-pink-100 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF2D55]"></span>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Workout List Card */}
        <div 
          onClick={() => setActiveModal('workout')}
          className="bg-white rounded-[3rem] overflow-hidden border border-pink-50 shadow-xl group cursor-pointer mb-12"
        >
          <div className="p-6 flex items-center justify-between border-b border-pink-50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#FFF5F6] rounded-xl text-[#FF2D55]">
                <Flame size={18} />
              </div>
              <h3 className="font-black text-gray-400 uppercase tracking-widest text-[10px]">Sync Your Movement</h3>
            </div>
            <div className="p-2 bg-pink-50 rounded-lg text-[#FF2D55] group-hover:bg-[#FF2D55] group-hover:text-white transition-colors">
              <ChevronRight size={16} />
            </div>
          </div>
          <div className="p-8">
             <div className="relative h-48 rounded-[2.5rem] overflow-hidden mb-8 bg-pink-50 shadow-inner">
                <img src={displayImage} alt="Workout" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Recommended</p>
                  <p className="text-xl font-bold">{insights.workoutFocus}</p>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-3">
               {insights.workoutItems.map(item => (
                 <div key={item} className="p-4 bg-[#FFF5F6] border border-pink-100 rounded-2xl flex items-center gap-2">
                   <Star size={14} className="text-[#FF2D55] fill-[#FF2D55] opacity-20" />
                   <span className="text-xs font-bold text-gray-800">{item}</span>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
