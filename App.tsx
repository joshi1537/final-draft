import React, { useState, useEffect } from 'react';
import { AppView, UserProfile, DailyLog, CycleInsights } from './types';
import LandingPage from './components/LandingPage';
import SignIn from './components/SignIn';
import OnboardingCycle from './components/OnboardingCycle';
import OnboardingHealth from './components/OnboardingHealth';
import OnboardingDiet from './components/OnboardingDiet';
import Dashboard from './components/Dashboard';
import PlanView from './components/PlanView';
import StatsView from './components/StatsView';
import ProfileView from './components/ProfileView';
import CheckInModal from './components/CheckInModal';
import BottomNav from './components/BottomNav';
import { GoogleGenAI, Type } from "@google/genai";
import { supabase } from './src/lib/supabase';
import EducationView from './components/EducationView';  // ← ADD THIS LINE


const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [insights, setInsights] = useState<CycleInsights | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const [tempUser, setTempUser] = useState<Partial<UserProfile>>({
    cycleLength: 28,
    periodDuration: 5,
    dietaryRestrictions: [],
  });

  // Use a small helper to support common env var names (VITE_GEMINI_API_KEY preferred)
  const getApiKey = (): string => {
    const procEnv = (typeof process !== 'undefined' ? (process.env as any) : undefined);

    // Safely read import.meta.env — avoid 'typeof import.meta' checks that can cause TS/JS errors
    let viteEnv: any;
    try {
      viteEnv = (import.meta as any).env;
    } catch {
      viteEnv = undefined;
    }

    const candidates = [
      viteEnv?.VITE_GEMINI_API_KEY,
      viteEnv?.VITE_API_KEY,
      procEnv?.VITE_GEMINI_API_KEY,
      procEnv?.VITE_API_KEY,
      procEnv?.API_KEY,
      procEnv?.GEMINI_API_KEY,
    ];

    const key = candidates.find((k) => typeof k === 'string' && k.length > 0) || '';
    if (!key) {
      console.warn('No Gemini API key found. Set VITE_GEMINI_API_KEY in your .env (or API_KEY/VITE_API_KEY).');
    }
    return key;
  };

  const fetchInsights = async (profile: UserProfile) => {
    setLoadingInsights(true);
    try {
      const ai = new GoogleGenAI({ apiKey: getApiKey() });
      const today = new Date().toISOString().split('T')[0];
      
      const prompt = `
        Today: ${today}
        Last Period: ${profile.lastPeriodDate}
        Cycle Length: ${profile.cycleLength}
        Conditions: ${profile.hasPCOS ? 'PCOS' : 'None'}, ${profile.hasEndometriosis ? 'Endometriosis' : ''}
        Diet: ${profile.dietaryRestrictions.join(', ')}
        
        Calculate the current cycle day and hormone phase. 
        Provide a list of specific food items (nutritionItems) and exercise types (workoutItems).
        Crucially, explain the biological 'WHY' for these choices based on current estrogen/progesterone levels.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: "You are Aura, an expert women's health AI. Return JSON. Focus on hormone-balancing lists. If the user is vegetarian, do not suggest meat. If they have PCOS, focus on insulin sensitivity. 'phaseImageKey' should be exactly one of: 'menstrual-rest', 'follicular-energy', 'ovulatory-bloom', 'luteal-slow'.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              currentPhase: { type: Type.STRING },
              cycleDay: { type: Type.INTEGER },
              daysUntilNextPeriod: { type: Type.INTEGER },
              phaseTitle: { type: Type.STRING },
              phaseDescription: { type: Type.STRING },
              fertilityStatus: { type: Type.STRING },
              nutritionFocus: { type: Type.STRING },
              nutritionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
              nutritionWhy: { type: Type.STRING },
              workoutFocus: { type: Type.STRING },
              workoutItems: { type: Type.ARRAY, items: { type: Type.STRING } },
              workoutWhy: { type: Type.STRING },
              phaseImageKey: { type: Type.STRING }
            },
            required: ["currentPhase", "cycleDay", "daysUntilNextPeriod", "phaseTitle", "phaseDescription", "fertilityStatus", "nutritionFocus", "nutritionItems", "nutritionWhy", "workoutFocus", "workoutItems", "workoutWhy", "phaseImageKey"]
          }
        }
      });

      const data = JSON.parse(response.text || "{}") as CycleInsights;
      setInsights(data);
    } catch (error) {
      console.error("Error fetching AI insights:", error);
    } finally {
      setLoadingInsights(false);
    }
  };

  useEffect(() => {
    if (user) fetchInsights(user);
  }, [user]);

  // Load daily logs from Supabase when user signs in
useEffect(() => {
  const loadDailyLogs = async () => {
    if (!user) return;
    
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return;
    
    const { data: logs } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('user_id', authData.user.id)
      .order('date', { ascending: false });
    
    if (logs) {
      const formattedLogs: DailyLog[] = logs.map(log => ({
        date: log.date,
        hasPeriod: log.has_period,
        symptoms: log.symptoms || [],
        nutritionNote: log.nutrition_note || ''
      }));
      setDailyLogs(formattedLogs);
    }
  };
  
  loadDailyLogs();
}, [user]);

  const handleSaveCheckIn = async (log: DailyLog) => {
  // Save to local state
  setDailyLogs(prev => [log, ...prev]);
  setIsCheckInOpen(false);
  
  // Save to Supabase
  const { data: authData } = await supabase.auth.getUser();
  if (authData?.user) {
    await supabase
      .from('daily_logs')
      .upsert({
        user_id: authData.user.id,
        date: log.date,
        has_period: log.hasPeriod,
        symptoms: log.symptoms,
        nutrition_note: log.nutritionNote
      }, {
        onConflict: 'user_id,date'
      });
  }
  
  if (user) fetchInsights(user);
};

  const handleLogPeriod = async (dateStr: string) => {
  const existingLogIndex = dailyLogs.findIndex(log => log.date === dateStr);
  
  if (existingLogIndex >= 0) {
    const updatedLogs = [...dailyLogs];
    updatedLogs[existingLogIndex] = {
      ...updatedLogs[existingLogIndex],
      hasPeriod: true
    };
    setDailyLogs(updatedLogs);
  } else {
    const newLog: DailyLog = {
      date: dateStr,
      hasPeriod: true,
      symptoms: [],
      nutritionNote: ''
    };
    setDailyLogs(prev => [newLog, ...prev]);
  }
  
  // Save to Supabase
  const { data: authData } = await supabase.auth.getUser();
  if (authData?.user) {
    await supabase
      .from('daily_logs')
      .upsert({
        user_id: authData.user.id,
        date: dateStr,
        has_period: true,
        symptoms: [],
        nutrition_note: ''
      }, {
        onConflict: 'user_id,date'
      });
  }
  
  if (user) fetchInsights(user);
};

  const handleLogout = () => {
    setUser(null);
    setDailyLogs([]);
    setInsights(null);
    setTempUser({
      cycleLength: 28,
      periodDuration: 5,
      dietaryRestrictions: [],
    });
    setView(AppView.LANDING);
  };

  const renderView = () => {
    switch (view) {
      case AppView.LANDING:
        return <LandingPage onStart={() => setView(AppView.SIGN_IN)} />;
      
      case AppView.SIGN_IN:
        return (
          <SignIn
            onSignIn={async (email) => {
              // Check if user has existing profile in Supabase
              const { data: authData } = await supabase.auth.getUser();
              
              if (authData?.user) {
                // Try to load existing profile
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', authData.user.id)
                  .single();
                
                if (profile && profile.cycle_length && profile.last_period_date) {
                  // User has completed onboarding before - load their data and go to dashboard
                  const loadedUser: UserProfile = {
                    email: profile.email,
                    cycleLength: profile.cycle_length,
                    periodDuration: profile.period_duration,
                    lastPeriodDate: profile.last_period_date,
                    hasPCOS: profile.has_pcos,
                    hasEndometriosis: profile.has_endometriosis,
                    dietaryRestrictions: profile.dietary_restrictions || []
                  };
                  
                  setUser(loadedUser);
                  setView(AppView.DASHBOARD);
                  return;
                }
              }
              
              // New user or profile incomplete - start onboarding
              setTempUser(p => ({ ...p, email }));
              setView(AppView.ONBOARDING_CYCLE);
            }}
            onBack={() => setView(AppView.LANDING)}
          />
        );
      
      case AppView.ONBOARDING_CYCLE:
        return (
          <OnboardingCycle
            onNext={(d) => {
              setTempUser(p => ({ ...p, ...d }));
              setView(AppView.ONBOARDING_HEALTH);
            }}
          />
        );
      
      case AppView.ONBOARDING_HEALTH:
        return (
          <OnboardingHealth
            onNext={(d) => {
              setTempUser(p => ({ ...p, ...d }));
              setView(AppView.ONBOARDING_DIET);
            }}
          />
        );
      
      case AppView.ONBOARDING_DIET:
        return (
          <OnboardingDiet
            onNext={async (d) => {
              const completeUser = { ...tempUser, dietaryRestrictions: d } as UserProfile;
              
              // Get the current Supabase user ID
              const { data: authData } = await supabase.auth.getUser();
              
              if (authData?.user) {
                // Update the profile in Supabase with onboarding data
                await supabase
                  .from('profiles')
                  .update({
                    cycle_length: completeUser.cycleLength,
                    period_duration: completeUser.periodDuration,
                    last_period_date: completeUser.lastPeriodDate,
                    has_pcos: completeUser.hasPCOS,
                    has_endometriosis: completeUser.hasEndometriosis,
                    dietary_restrictions: completeUser.dietaryRestrictions
                  })
                  .eq('id', authData.user.id);
              }
              
              setUser(completeUser);
              setView(AppView.DASHBOARD);
            }}
          />
        );
      
      case AppView.DASHBOARD:
        return <Dashboard user={user!} insights={insights} loading={loadingInsights} />;
      
      case AppView.PLAN:
        return <PlanView user={user!} logs={dailyLogs} onLogPeriod={handleLogPeriod} />;
      
      case AppView.STATS:
        return <StatsView logs={dailyLogs} user={user!} />;

      case AppView.EDUCATION:
        return <EducationView user={user!} insights={insights} dailyLogs={dailyLogs} />;
      
      case AppView.PROFILE:
        return <ProfileView user={user!} onUpdate={setUser} onLogout={handleLogout} />;
      
      default:
        return <Dashboard user={user!} insights={insights} loading={loadingInsights} />;
    }
  };

const showNav = [AppView.DASHBOARD, AppView.PLAN, AppView.STATS, AppView.EDUCATION, AppView.PROFILE].includes(view);

  return (
    <div className="min-h-screen relative max-w-md mx-auto bg-[#FFF5F6] shadow-2xl overflow-hidden flex flex-col">
      <main className="flex-1 overflow-y-auto pb-24">
        {renderView()}
      </main>
      {showNav && (
        <BottomNav
          activeView={view}
          setView={setView}
          onPlusClick={() => setIsCheckInOpen(true)}
        />
      )}
      {isCheckInOpen && (
        <CheckInModal
          onClose={() => setIsCheckInOpen(false)}
          onSave={handleSaveCheckIn}
        />
      )}
    </div>
  );
};

export default App;