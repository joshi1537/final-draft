
import React from 'react';
import { Heart, Home, Calendar, BarChart3, User, Plus, Bell, MessageCircle } from 'lucide-react';

export const COLORS = {
  primary: '#FF2D55',
  primaryLight: '#FFDDE2',
  bg: '#FFF5F6',
  text: '#1A1A1A',
  textMuted: '#6B7280',
};

export const SYMPTOMS = [
  'Acne', 'Bloating', 'Cramps', 'Headache', 'Mood Swings', 'Fatigue', 'Cravings'
];

export const DIETARY_OPTIONS = [
  'None', 'Vegetarian', 'Vegan', 'Pescetarian', 'Gluten-Free', 'Dairy-Free', 'Keto'
];

export const HEALTH_CONDITIONS = [
  { id: 'pcos', label: 'PCOS' },
  { id: 'endo', label: 'Endometriosis' },
  { id: 'pms', label: 'Severe PMS / PMDD' },
  { id: 'fibroids', label: 'Uterine Fibroids' },
];

export const Logo = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className="bg-[#FF2D55] p-2 rounded-xl shadow-lg shadow-pink-200">
      <Heart size={size} fill="white" className="text-white" />
    </div>
    <span className="text-2xl font-bold tracking-tight text-[#1A1A1A]">Aura</span>
  </div>
);
