export enum AppView {
  LANDING = 'LANDING',
  SIGN_IN = 'SIGN_IN',
  ONBOARDING_CYCLE = 'ONBOARDING_CYCLE',
  ONBOARDING_HEALTH = 'ONBOARDING_HEALTH',
  ONBOARDING_DIET = 'ONBOARDING_DIET',
  DASHBOARD = 'DASHBOARD',
  PLAN = 'PLAN',
  STATS = 'STATS',
  EDUCATION = 'EDUCATION',  // ← ADD THIS LINE
  PROFILE = 'PROFILE'
}

export interface UserProfile {
  email: string;
  cycleLength: number;
  periodDuration: number;
  lastPeriodDate: string;
  hasPCOS: boolean;
  hasEndometriosis: boolean;
  dietaryRestrictions: string[];
}

export interface CycleInsights {
  currentPhase: string;
  cycleDay: number;
  daysUntilNextPeriod: number;
  phaseTitle: string;
  phaseDescription: string;
  fertilityStatus: string;
  nutritionItems: string[]; // List of specific foods
  nutritionFocus: string;    // e.g. "Omega-3s & Magnesium"
  nutritionWhy: string;
  workoutItems: string[];    // List of exercises
  workoutFocus: string;      // e.g. "Low Impact & Stretching"
  workoutWhy: string;
  phaseImageKey: string;     // Keyword for stable phase-based image
}

export type Symptom = 'Acne' | 'Bloating' | 'Cramps' | 'Headache' | 'Mood Swings' | 'Fatigue' | 'Cravings';

export interface DailyLog {
  date: string;
  hasPeriod: boolean;
  symptoms: Symptom[];
  nutritionNote: string;
}

export enum CyclePhase {
  MENSTRUAL = 'Menstrual',
  FOLLICULAR = 'Follicular',
  OVULATORY = 'Ovulatory',
  LUTEAL = 'Luteal'
}
