import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Info, Bell } from 'lucide-react';
import { UserProfile, DailyLog } from '../types';
import { Logo } from '../constants';

interface Props {
  user: UserProfile;
  logs: DailyLog[];
}

const PlanView: React.FC<Props> = ({ user, logs }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Calculate calendar data dynamically
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of month and total days in month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    // Get previous month's trailing days
    const prevMonthLastDay = new Date(year, month, 0);
    const prevMonthDays = prevMonthLastDay.getDate();
    const trailingDays = startDayOfWeek;
    
    // Calculate period and fertility days
    const lastPeriod = new Date(user.lastPeriodDate);
    const cycleLength = user.cycleLength || 28;
    const periodDuration = user.periodDuration || 5;
    
    // Function to check if a date is during period
    const isPeriodDay = (date: Date): boolean => {
      const daysSinceLastPeriod = Math.floor((date.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
      const dayInCycle = ((daysSinceLastPeriod % cycleLength) + cycleLength) % cycleLength;
      return dayInCycle < periodDuration;
    };
    
    // Function to check if a date is in fertility window (ovulation ±2 days)
    const isFertilityDay = (date: Date): boolean => {
      const daysSinceLastPeriod = Math.floor((date.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
      const dayInCycle = ((daysSinceLastPeriod % cycleLength) + cycleLength) % cycleLength;
      const ovulationDay = cycleLength - 14; // Typically 14 days before next period
      return Math.abs(dayInCycle - ovulationDay) <= 2;
    };
    
    return {
      year,
      month,
      totalDays,
      trailingDays,
      prevMonthDays,
      isPeriodDay,
      isFertilityDay
    };
  }, [currentDate, user.lastPeriodDate, user.cycleLength, user.periodDuration]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const today = new Date();
  const isToday = (day: number) => {
    return day === today.getDate() && 
           calendarData.month === today.getMonth() && 
           calendarData.year === today.getFullYear();
  };

  // Generate calendar days array
  const calendarDays = useMemo(() => {
    const days: Array<{ day: number; isPrevMonth: boolean; isNextMonth: boolean; date: Date }> = [];
    
    // Previous month trailing days
    for (let i = calendarData.trailingDays - 1; i >= 0; i--) {
      const day = calendarData.prevMonthDays - i;
      const date = new Date(calendarData.year, calendarData.month - 1, day);
      days.push({ day, isPrevMonth: true, isNextMonth: false, date });
    }
    
    // Current month days
    for (let day = 1; day <= calendarData.totalDays; day++) {
      const date = new Date(calendarData.year, calendarData.month, day);
      days.push({ day, isPrevMonth: false, isNextMonth: false, date });
    }
    
    // Next month leading days to fill the grid
    const remainingCells = 42 - days.length; // 6 weeks * 7 days
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(calendarData.year, calendarData.month + 1, day);
      days.push({ day, isPrevMonth: false, isNextMonth: true, date });
    }
    
    return days;
  }, [calendarData]);

  return (
    <div className="flex flex-col min-h-full">
      <header className="px-6 py-8 flex justify-between items-center bg-white sticky top-0 z-10">
        <Logo size={20} />
        <div className="flex gap-4">
         
          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-[#FFDDE2] bg-[#FFDDE2] flex items-center justify-center font-bold text-[#FF2D55]">
            {user.email[0].toUpperCase()}
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-pink-50">
          <div className="bg-[#FF2D55] p-8 text-white">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-serif italic">{monthName}</h2>
              <div className="flex gap-4">
                <button 
                  onClick={() => navigateMonth('prev')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Previous month"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={() => navigateMonth('next')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs tracking-widest opacity-80 uppercase">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>
          </div>

          <div className="p-8 grid grid-cols-7 gap-y-6 text-center">
            {calendarDays.map((dayInfo, index) => {
              const isPeriod = !dayInfo.isPrevMonth && !dayInfo.isNextMonth && calendarData.isPeriodDay(dayInfo.date);
              const isFertility = !dayInfo.isPrevMonth && !dayInfo.isNextMonth && calendarData.isFertilityDay(dayInfo.date);
              const isTodayDate = !dayInfo.isPrevMonth && !dayInfo.isNextMonth && isToday(dayInfo.day);
              const isOtherMonth = dayInfo.isPrevMonth || dayInfo.isNextMonth;

              return (
                <div key={index} className="flex flex-col items-center gap-1 relative">
                  <div className={`
                    w-12 h-16 flex items-center justify-center rounded-2xl text-sm font-bold transition-all
                    ${isOtherMonth ? 'text-gray-300' : 'text-gray-700'}
                    ${isPeriod && !isTodayDate ? 'bg-[#FFF5F6] text-[#FF2D55]' : ''}
                    ${isFertility && !isPeriod && !isTodayDate ? 'bg-pink-50/50 text-[#FF2D55]' : ''}
                    ${isTodayDate ? 'bg-[#FF2D55] text-white shadow-lg shadow-pink-200' : ''}
                  `}>
                    {dayInfo.day}
                  </div>
                  {(isPeriod || isFertility) && !isTodayDate && (
                    <div className="flex gap-0.5">
                      <div className={`w-1 h-1 rounded-full ${isPeriod ? 'bg-[#FF2D55]' : 'bg-pink-200'}`}></div>
                      {isFertility && <div className="w-1 h-1 rounded-full bg-pink-200"></div>}
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
                <span className="text-sm font-medium text-gray-500">Period days</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 rounded-full bg-pink-50"></div>
                <span className="text-sm font-medium text-gray-500">Fertility Window (Ovulation ±2 days)</span>
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
Don’t forget to tap the + icon to log your entries and keep your history up to date. Aura gets smarter with every check-in!              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanView;