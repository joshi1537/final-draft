import React, { useMemo } from 'react';
import { Bell, TrendingUp, Calendar, Utensils, Activity } from 'lucide-react';
import { DailyLog, Symptom } from '../types';
import { Logo, SYMPTOMS } from '../constants';

interface Props {
  logs: DailyLog[];
  user: any; // Add user if needed for additional context
}

const StatsView: React.FC<Props> = ({ logs }) => {
  // Calculate statistics from logs
  const stats = useMemo(() => {
    const totalLogs = logs.length;
    const logsWithPeriod = logs.filter(log => log.hasPeriod).length;
    const logsWithSymptoms = logs.filter(log => log.symptoms.length > 0).length;
    const logsWithNutrition = logs.filter(log => log.nutritionNote && log.nutritionNote.trim() !== '').length;

    // Count symptom frequency
    const symptomCounts: Record<Symptom, number> = {
      'Acne': 0,
      'Bloating': 0,
      'Cramps': 0,
      'Headache': 0,
      'Mood Swings': 0,
      'Fatigue': 0,
      'Cravings': 0
    };

    logs.forEach(log => {
      log.symptoms.forEach(symptom => {
        if (symptom in symptomCounts) {
          symptomCounts[symptom]++;
        }
      });
    });

    // Sort symptoms by frequency
    const topSymptoms = Object.entries(symptomCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    // Get recent nutrition logs
    const recentNutritionLogs = logs
      .filter(log => log.nutritionNote && log.nutritionNote.trim() !== '')
      .slice(0, 10);

    return {
      totalLogs,
      logsWithPeriod,
      logsWithSymptoms,
      logsWithNutrition,
      symptomCounts,
      topSymptoms,
      recentNutritionLogs
    };
  }, [logs]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header className="px-6 py-8 flex justify-between items-center bg-white sticky top-0 z-10">
        <Logo size={20} />
        <div className="flex gap-4">
          <button className="p-3 bg-white border border-pink-100 rounded-2xl shadow-sm text-gray-400">
            <Bell size={20} />
          </button>
          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-[#FFDDE2] bg-[#FFDDE2] flex items-center justify-center font-bold text-[#FF2D55]">
            A
          </div>
        </div>
      </header>

      <div className="p-6 pb-32">
        <h1 className="text-4xl font-serif italic text-[#FF2D55] mb-2">Your Stats</h1>
        <p className="text-gray-500 mb-8">Track your progress and patterns</p>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-pink-50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-pink-50 rounded-xl">
                <Calendar size={20} className="text-[#FF2D55]" />
              </div>
            </div>
            <p className="text-3xl font-bold text-[#FF2D55]">{stats.totalLogs}</p>
            <p className="text-sm text-gray-500 font-medium">Total Logs</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-pink-50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-pink-50 rounded-xl">
                <Activity size={20} className="text-[#FF2D55]" />
              </div>
            </div>
            <p className="text-3xl font-bold text-[#FF2D55]">{stats.logsWithPeriod}</p>
            <p className="text-sm text-gray-500 font-medium">Period Days</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-pink-50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-pink-50 rounded-xl">
                <TrendingUp size={20} className="text-[#FF2D55]" />
              </div>
            </div>
            <p className="text-3xl font-bold text-[#FF2D55]">{stats.logsWithSymptoms}</p>
            <p className="text-sm text-gray-500 font-medium">With Symptoms</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-pink-50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-pink-50 rounded-xl">
                <Utensils size={20} className="text-[#FF2D55]" />
              </div>
            </div>
            <p className="text-3xl font-bold text-[#FF2D55]">{stats.logsWithNutrition}</p>
            <p className="text-sm text-gray-500 font-medium">Nutrition Logs</p>
          </div>
        </div>

        {/* Top Symptoms */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-lg border border-pink-50 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp size={18} className="text-[#FF2D55]" />
            <h3 className="font-bold text-gray-700 text-lg">Most Common Symptoms</h3>
          </div>
          
          {stats.topSymptoms.length > 0 ? (
            <div className="space-y-4">
              {stats.topSymptoms.map(([symptom, count]) => (
                <div key={symptom} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-sm font-medium text-gray-700">{symptom}</span>
                    <div className="flex-1 bg-pink-50 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-[#FF2D55] h-full rounded-full transition-all"
                        style={{ width: `${Math.min((count / stats.totalLogs) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#FF2D55] ml-3">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No symptoms logged yet</p>
          )}
        </div>

        {/* Nutrition Logs Timeline */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-lg border border-pink-50">
          <div className="flex items-center gap-3 mb-6">
            <Utensils size={18} className="text-[#FF2D55]" />
            <h3 className="font-bold text-gray-700 text-lg">Recent Nutrition Logs</h3>
          </div>
          
          {stats.recentNutritionLogs.length > 0 ? (
            <div className="space-y-4">
              {stats.recentNutritionLogs.map((log, index) => (
                <div 
                  key={log.date + index} 
                  className="bg-[#FFF5F6] rounded-2xl p-4 border border-pink-100"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-[#FF2D55]">
                      {formatDate(log.date)}
                    </span>
                    {log.hasPeriod && (
                      <span className="text-xs bg-[#FF2D55] text-white px-2 py-1 rounded-lg">
                        Period Day
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">{log.nutritionNote}</p>
                  {log.symptoms.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {log.symptoms.map(symptom => (
                        <span 
                          key={symptom}
                          className="text-xs bg-white text-gray-600 px-3 py-1 rounded-full border border-pink-100"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils size={24} className="text-pink-300" />
              </div>
              <p className="text-gray-400 mb-2">No nutrition logs yet</p>
              <p className="text-xs text-gray-300">
                Start logging your meals to see them here!
              </p>
            </div>
          )}
        </div>

        {/* Empty State if no logs */}
        {stats.totalLogs === 0 && (
          <div className="bg-gradient-to-br from-pink-50 to-white rounded-[2.5rem] p-8 shadow-lg border border-pink-100 mt-6 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <TrendingUp size={32} className="text-[#FF2D55]" />
            </div>
            <h3 className="text-xl font-serif italic text-[#FF2D55] mb-2">Start Your Journey</h3>
            <p className="text-gray-500 text-sm">
              Log your daily symptoms and nutrition to see insights and patterns here!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsView;