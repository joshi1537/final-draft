
import React from 'react';
import { BarChart3, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { DailyLog } from '../types';
import { Logo } from '../constants';

interface Props {
  logs: DailyLog[];
}

const StatsView: React.FC<Props> = ({ logs }) => {
  const recentLogs = logs.slice(0, 10);
  
  const symptomCounts: Record<string, number> = {};
  logs.forEach(log => {
    log.symptoms.forEach(s => {
      symptomCounts[s] = (symptomCounts[s] || 0) + 1;
    });
  });

  const topSymptoms = Object.entries(symptomCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="flex flex-col min-h-full bg-white">
      <header className="px-6 py-8 flex justify-between items-center border-b border-pink-50 sticky top-0 bg-white/90 backdrop-blur-md z-10">
        <Logo size={20} />
        <div className="p-3 bg-pink-50 rounded-2xl text-[#FF2D55]">
          <BarChart3 size={20} />
        </div>
      </header>

      <div className="p-6 space-y-8 pb-32">
        <div className="flex items-center gap-3">
           <h2 className="text-4xl font-serif italic text-[#1A1A1A]">Your Patterns</h2>
           <div className="flex-1 h-[2px] bg-pink-50 mt-2"></div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#FFF5F6] p-6 rounded-[2.5rem] border border-pink-100">
            <p className="text-[10px] font-black tracking-widest text-[#FF2D55] uppercase mb-1">Total Logs</p>
            <p className="text-3xl font-bold text-gray-800">{logs.length}</p>
          </div>
          <div className="bg-[#FFF5F6] p-6 rounded-[2.5rem] border border-pink-100">
            <p className="text-[10px] font-black tracking-widest text-[#FF2D55] uppercase mb-1">Top Symptom</p>
            <p className="text-lg font-bold text-gray-800 truncate">{topSymptoms[0]?.[0] || 'None'}</p>
          </div>
        </div>

        {/* Symptom Trends */}
        <section className="bg-white rounded-[3rem] border border-pink-50 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp size={20} className="text-[#FF2D55]" />
            <h3 className="font-bold text-gray-500 text-sm uppercase tracking-widest">Symptom Trends</h3>
          </div>
          
          <div className="space-y-6">
            {topSymptoms.length > 0 ? topSymptoms.map(([name, count]) => (
              <div key={name} className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-gray-700">{name}</span>
                  <span className="text-[#FF2D55]">{Math.round((count / logs.length) * 100)}%</span>
                </div>
                <div className="h-2 bg-pink-50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#FF2D55] transition-all duration-1000" 
                    style={{ width: `${(count / logs.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            )) : (
              <div className="text-center py-10">
                <AlertCircle className="mx-auto text-gray-200 mb-2" size={32} />
                <p className="text-sm text-gray-400 font-medium">No symptoms logged yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* History Log */}
        <section>
          <div className="flex items-center gap-3 mb-6 px-2">
            <Calendar size={18} className="text-gray-400" />
            <h3 className="font-bold text-gray-400 text-sm uppercase tracking-widest">Recent Activity</h3>
          </div>
          
          <div className="space-y-3">
            {recentLogs.map((log, i) => (
              <div key={i} className="bg-white p-6 rounded-[2rem] border border-pink-50 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-sm font-bold text-gray-800">{new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{log.hasPeriod ? 'Period Day' : 'Normal Day'}</p>
                </div>
                <div className="flex gap-1 flex-wrap justify-end max-w-[150px]">
                  {log.symptoms.slice(0, 2).map(s => (
                    <span key={s} className="px-3 py-1 bg-pink-50 text-[10px] font-bold text-[#FF2D55] rounded-full">{s}</span>
                  ))}
                  {log.symptoms.length > 2 && <span className="text-[10px] font-bold text-gray-300">+{log.symptoms.length - 2}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StatsView;
