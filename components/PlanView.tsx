
import React from 'react';
// Added Bell to the imported icons from lucide-react
import { ChevronLeft, ChevronRight, Info, Bell } from 'lucide-react';
import { UserProfile, DailyLog } from '../types';
import { Logo } from '../constants';

interface Props {
  user: UserProfile;
  logs: DailyLog[];
}

const PlanView: React.FC<Props> = ({ user, logs }) => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentMonth = "January 2026";

  const periodDays = [4, 5, 6, 7];
  const fertilityDays = [15, 16, 17, 18];
  const today = 31;

  return (
    <div className="flex flex-col min-h-full">
      <header className="px-6 py-8 flex justify-between items-center bg-white sticky top-0 z-10">
        <Logo size={20} />
        <div className="flex gap-4">
           <button className="p-3 bg-white border border-pink-100 rounded-2xl shadow-sm text-gray-400">
            <Bell size={20} />
          </button>
          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-[#FFDDE2] bg-[#FFDDE2] flex items-center justify-center font-bold text-[#FF2D55]">
            {user.email[0].toUpperCase()}
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-pink-50">
          <div className="bg-[#FF2D55] p-8 text-white">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-serif italic">{currentMonth}</h2>
              <div className="flex gap-4">
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors"><ChevronLeft size={24} /></button>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors"><ChevronRight size={24} /></button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs tracking-widest opacity-80 uppercase">
              <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
            </div>
          </div>

          <div className="p-8 grid grid-cols-7 gap-y-6 text-center">
            {/* Empty spacer for calendar logic (simulated) */}
            <span className="text-gray-200">28</span>
            <span className="text-gray-200">29</span>
            <span className="text-gray-200">30</span>
            <span className="text-gray-200">31</span>
            
            {days.map(day => {
              const isPeriod = periodDays.includes(day);
              const isFertility = fertilityDays.includes(day);
              const isToday = day === today;

              return (
                <div key={day} className="flex flex-col items-center gap-1 relative">
                  <div className={`
                    w-12 h-16 flex items-center justify-center rounded-2xl text-sm font-bold transition-all
                    ${isPeriod ? 'bg-[#FFF5F6] text-[#FF2D55]' : 'text-gray-700'}
                    ${isFertility ? 'bg-pink-50/50 text-[#FF2D55]' : ''}
                    ${isToday ? 'bg-[#FF2D55] text-white shadow-lg shadow-pink-200' : ''}
                  `}>
                    {day}
                  </div>
                  {(isPeriod || isFertility) && (
                    <div className="flex gap-0.5">
                      <div className={`w-1 h-1 rounded-full ${isPeriod ? 'bg-[#FF2D55]' : 'bg-pink-200'}`}></div>
                      {day === 17 && <div className="w-1 h-1 rounded-full bg-pink-200"></div>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-8 mb-12">
          <div className="bg-white rounded-[2.5rem] p-6 border border-pink-50 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Info size={18} className="text-[#FF2D55]" />
              <h4 className="font-bold text-gray-700">Calendar Legend</h4>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 rounded-full bg-[#FFF5F6] border border-pink-100"></div>
                <span className="text-sm font-medium text-gray-500">Predicted Period days</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 rounded-full bg-pink-50"></div>
                <span className="text-sm font-medium text-gray-500">Fertility Window</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 rounded-full bg-[#FF2D55]"></div>
                <span className="text-sm font-medium text-gray-500">Today</span>
              </div>
            </div>
          </div>

          <div className="bg-[#FFF5F6] rounded-[2.5rem] p-6 border border-pink-50 shadow-sm flex items-start gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-md border border-pink-50 text-[#FF2D55]">
               <Logo size={18} />
            </div>
            <div>
              <h4 className="font-bold text-[#1A1A1A] mb-1">Pro Tip</h4>
              <p className="text-xs text-[#FF2D55] font-medium leading-relaxed">
                Click on any date to log symptoms, moods, or cravings for that day. Aura gets smarter with every log!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanView;
