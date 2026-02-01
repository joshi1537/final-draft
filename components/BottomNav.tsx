
import React from 'react';
import { Home, Calendar, BarChart3, User, Plus } from 'lucide-react';
import { AppView } from '../types';

interface Props {
  activeView: AppView;
  setView: (v: AppView) => void;
  onPlusClick: () => void;
}

const BottomNav: React.FC<Props> = ({ activeView, setView, onPlusClick }) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-sm flex items-center z-40">
      <div className="w-full bg-white rounded-[2.5rem] shadow-2xl border border-pink-50 flex items-center justify-around h-20 px-4 relative">
        
        {/* Navigation Items (Left) */}
        <div className="flex flex-1 justify-around">
          <button 
            onClick={() => setView(AppView.DASHBOARD)}
            className={`flex flex-col items-center gap-1 transition-all ${activeView === AppView.DASHBOARD ? 'text-[#FF2D55]' : 'text-gray-300'}`}
          >
            <div className={`p-1 rounded-lg ${activeView === AppView.DASHBOARD ? 'bg-pink-50' : ''}`}>
              <Home size={22} fill={activeView === AppView.DASHBOARD ? '#FF2D55' : 'none'} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">Home</span>
          </button>
          
          <button 
            onClick={() => setView(AppView.PLAN)}
            className={`flex flex-col items-center gap-1 transition-all ${activeView === AppView.PLAN ? 'text-[#FF2D55]' : 'text-gray-300'}`}
          >
            <div className={`p-1 rounded-lg ${activeView === AppView.PLAN ? 'bg-pink-50' : ''}`}>
              <Calendar size={22} fill={activeView === AppView.PLAN ? '#FF2D55' : 'none'} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">Plan</span>
          </button>
        </div>

        {/* The Plus Button - Large Red Rounded Square as per user screenshot */}
        <div className="relative -top-8 mx-2">
          <button 
            onClick={onPlusClick}
            className="w-20 h-20 bg-[#FF2D55] rounded-[2rem] shadow-2xl shadow-pink-300 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={48} strokeWidth={2.5} />
          </button>
        </div>

        {/* Navigation Items (Right) */}
        <div className="flex flex-1 justify-around">
          <button 
            onClick={() => setView(AppView.STATS)}
            className={`flex flex-col items-center gap-1 transition-all ${activeView === AppView.STATS ? 'text-[#FF2D55]' : 'text-gray-300'}`}
          >
            <div className={`p-1 rounded-lg ${activeView === AppView.STATS ? 'bg-pink-50' : ''}`}>
              <BarChart3 size={22} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">Stats</span>
          </button>
          
          <button 
            onClick={() => setView(AppView.PROFILE)}
            className={`flex flex-col items-center gap-1 transition-all ${activeView === AppView.PROFILE ? 'text-[#FF2D55]' : 'text-gray-300'}`}
          >
            <div className={`p-1 rounded-lg ${activeView === AppView.PROFILE ? 'bg-pink-50' : ''}`}>
              <User size={22} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">Profile</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default BottomNav;
