
import React from 'react';
import { User, Settings, Shield, Bell, Heart, ArrowRight, LogOut } from 'lucide-react';
import { UserProfile } from '../types';
import { Logo } from '../constants';

interface Props {
  user: UserProfile;
  onUpdate: (u: UserProfile) => void;
}

const ProfileView: React.FC<Props> = ({ user, onUpdate }) => {
  const sections = [
    { icon: <Heart size={20} />, label: 'Health Conditions', value: `${user.hasPCOS ? 'PCOS' : ''} ${user.hasEndometriosis ? 'Endometriosis' : ''}`.trim() || 'None' },
    { icon: <Settings size={20} />, label: 'Cycle Goal', value: 'Syncing' },
    { icon: <Bell size={20} />, label: 'Notifications', value: 'Daily Reminder' },
    { icon: <Shield size={20} />, label: 'Privacy', value: 'Locked' },
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#FFF5F6]">
      <header className="px-6 py-8 flex justify-between items-center bg-white border-b border-pink-50">
        <Logo size={20} />
        <button className="text-[#FF2D55] font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
          Logout <LogOut size={14} />
        </button>
      </header>

      <div className="p-6 space-y-8 pb-32">
        {/* User Header */}
        <div className="flex flex-col items-center text-center mt-4">
          <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-[#FF2D55] to-pink-300 p-1 mb-4 shadow-xl shadow-pink-100">
            <div className="w-full h-full bg-white rounded-[2.3rem] flex items-center justify-center text-4xl font-serif italic text-[#FF2D55] font-bold">
              {user.email[0].toUpperCase()}
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">{user.email.split('@')[0]}</h2>
          <p className="text-gray-400 font-medium">Aura Member since Jan 2026</p>
        </div>

        {/* Health Profile Card */}
        <section className="bg-white rounded-[3rem] p-8 shadow-sm border border-pink-50">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Personal Wellness</h3>
          <div className="space-y-6">
            {sections.map((s, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#FFF5F6] rounded-2xl text-[#FF2D55] group-hover:bg-[#FF2D55] group-hover:text-white transition-all">
                    {s.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">{s.label}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{s.value}</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-gray-200 group-hover:text-[#FF2D55] transition-colors" />
              </div>
            ))}
          </div>
        </section>

        {/* Dietary Prefs */}
        <section className="bg-white rounded-[3rem] p-8 shadow-sm border border-pink-50">
           <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Dietary Restrictions</h3>
           <div className="flex flex-wrap gap-2">
             {user.dietaryRestrictions.map(d => (
               <span key={d} className="px-4 py-2 bg-[#FFF5F6] text-[#FF2D55] text-[10px] font-bold rounded-full border border-pink-100 uppercase tracking-widest">
                 {d}
               </span>
             ))}
             {user.dietaryRestrictions.length === 0 && <span className="text-sm font-medium text-gray-300">No restrictions added.</span>}
           </div>
        </section>

        <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mt-10">
          Syncing with your biology since 2026
        </p>
      </div>
    </div>
  );
};

export default ProfileView;
