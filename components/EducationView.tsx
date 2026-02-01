import React, { useEffect, useState } from 'react';
import { Bell, BookOpen, Sparkles, Loader } from 'lucide-react';
import { UserProfile, CycleInsights, DailyLog } from '../types';
import { Logo } from '../constants';
import { GoogleGenAI } from "@google/genai";

interface Props {
  user: UserProfile;
  insights: CycleInsights | null;
  dailyLogs: DailyLog[];
}

interface EducationContent {
  hormoneExplanation: string;
  phaseScience: string;
  nutritionDeepDive: string;
  exerciseDeepDive: string;
  lifestyleTips: string;
}

const EducationView: React.FC<Props> = ({ user, insights, dailyLogs }) => {
  const [educationContent, setEducationContent] = useState<EducationContent | null>(null);
  const [personalizedAdvice, setPersonalizedAdvice] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const getApiKey = (): string => {
    const procEnv = (typeof process !== 'undefined' ? (process.env as any) : undefined);
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
    return key;
  };

  useEffect(() => {
    const fetchEducation = async () => {
      if (!insights) return;
      
      setLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: getApiKey() });
        
        const prompt = `
You are Aura, a women's health educator. The user is currently in their ${insights.phaseTitle} (Day ${insights.cycleDay} of cycle).

Current recommendations:
- Nutrition: ${insights.nutritionFocus}
- Foods: ${insights.nutritionItems.join(', ')}
- Exercise: ${insights.workoutFocus}
- Workouts: ${insights.workoutItems.join(', ')}

Provide detailed educational content in 5 sections. Be specific, scientific, and engaging:

1. HORMONE EXPLANATION (150 words):
Explain what estrogen and progesterone are doing RIGHT NOW in this phase. What are the actual biological mechanisms? How do these hormones affect energy, mood, metabolism, and body composition during this phase?

2. PHASE SCIENCE (150 words):
Deep dive into the science of the ${insights.phaseTitle}. What's happening in the ovaries, uterus, and brain? Why does the body feel the way it does during this phase? Include specific physiological changes.

3. NUTRITION DEEP DIVE (200 words):
Why SPECIFICALLY do we recommend ${insights.nutritionItems.slice(0, 3).join(', ')}? 
- What nutrients do they provide?
- How do these nutrients support hormone production/metabolism?
- What's the science behind ${insights.nutritionFocus}?
- Why are these foods better than others during this phase?

4. EXERCISE DEEP DIVE (200 words):
Why SPECIFICALLY ${insights.workoutItems.slice(0, 2).join(' and ')}?
- How does exercise intensity affect hormones in this phase?
- What happens to cortisol, insulin sensitivity, and recovery?
- Why is this type of movement optimal now?
- What should be avoided and why?

5. LIFESTYLE TIPS (100 words):
Sleep, stress management, and other lifestyle factors specific to this phase.

Return as JSON with keys: hormoneExplanation, phaseScience, nutritionDeepDive, exerciseDeepDive, lifestyleTips
        `;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: {
            systemInstruction: "You are an expert women's health educator. Be scientific but accessible. Use specific mechanisms and research-backed explanations.",
            responseMimeType: "application/json"
          }
        });

        const content = JSON.parse(response.text || "{}");
        setEducationContent(content);

        // Now handle personalized advice
        if (dailyLogs.length > 0) {
          const logsText = dailyLogs.map(log => 
            `Date: ${log.date}, Period: ${log.hasPeriod ? 'Yes' : 'No'}, Symptoms: ${log.symptoms.join(', ')}, Nutrition: ${log.nutritionNote}`
          ).join('\n');

          const personalizedPrompt = `
You are Aura, a women's health AI. Analyze the user's daily logs and provide personalized insights and advice.

User's logs:
${logsText}

Current phase: ${insights.phaseTitle} (Day ${insights.cycleDay})

Provide a personalized blurb (150-200 words) that:
- Notices patterns in symptoms (e.g., "I noticed you're experiencing bloating and cramps...")
- Comments on logged foods (e.g., "Great that you logged eating corn, which is rich in...")
- Gives specific dietary suggestions based on symptoms and phase
- Be encouraging and actionable

Return as plain text.
          `;

          const personalizedResponse = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: personalizedPrompt,
            config: {
              systemInstruction: "Be empathetic, scientific, and personalized. Focus on actionable advice."
            }
          });

          setPersonalizedAdvice(personalizedResponse.text || 'Unable to generate personalized advice.');
        } else {
          setPersonalizedAdvice('Add logs to see personalized insights.');
        }
      } catch (error) {
        console.error("Error fetching content:", error);
        setPersonalizedAdvice('Generating personalized advice.');
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, [insights, dailyLogs]);

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header className="px-6 py-8 flex justify-between items-center bg-white sticky top-0 z-10">
        <Logo size={20} />
        <div className="flex gap-4">
         
          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-[#FFDDE2] bg-[#FFDDE2] flex items-center justify-center font-bold text-[#FF2D55]">
            {user.email[0].toUpperCase()}
          </div>
        </div>
      </header>

      <div className="p-6 pb-32">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen size={28} className="text-[#FF2D55]" />
          <h1 className="text-4xl font-serif italic text-[#FF2D55]">Education</h1>
        </div>
        <p className="text-gray-500 mb-8">Deep dive into your cycle science</p>

        {/* Current Phase Badge */}
        {insights && (
          <div className="bg-gradient-to-r from-[#FF2D55] to-pink-400 rounded-3xl p-6 mb-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={20} />
              <span className="text-sm font-bold uppercase tracking-wide">Your Current Phase</span>
            </div>
            <h2 className="text-3xl font-serif italic mb-1">{insights.phaseTitle}</h2>
            <p className="text-pink-100">Day {insights.cycleDay} of your cycle</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader size={40} className="text-[#FF2D55] animate-spin mb-4" />
            <p className="text-gray-500">Generating personalized education...</p>
          </div>
        )}

        {!loading && educationContent && (
          <div className="space-y-6">
            {/* Hormone Explanation */}
            <div className="bg-white rounded-[2.5rem] p-6 shadow-lg border border-pink-50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">🧬</span>
                </div>
                <h3 className="font-bold text-lg text-gray-800">What Your Hormones Are Doing</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{educationContent.hormoneExplanation}</p>
            </div>

            {/* Phase Science */}
            <div className="bg-white rounded-[2.5rem] p-6 shadow-lg border border-pink-50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">🔬</span>
                </div>
                <h3 className="font-bold text-lg text-gray-800">The Science of This Phase</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{educationContent.phaseScience}</p>
            </div>

            {/* Nutrition Deep Dive */}
            <div className="bg-white rounded-[2.5rem] p-6 shadow-lg border border-pink-50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">🥗</span>
                </div>
                <h3 className="font-bold text-lg text-gray-800">Why These Foods?</h3>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{educationContent.nutritionDeepDive}</p>
            </div>

            {/* Exercise Deep Dive */}
            <div className="bg-white rounded-[2.5rem] p-6 shadow-lg border border-pink-50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">💪</span>
                </div>
                <h3 className="font-bold text-lg text-gray-800">Why This Exercise?</h3>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{educationContent.exerciseDeepDive}</p>
            </div>


            {/* Personalized Insights */}
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-[2.5rem] p-6 shadow-lg border border-purple-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-xl">💡</span>
                </div>
                <h3 className="font-bold text-lg text-gray-800">Personalized Insights from Your Logs</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{personalizedAdvice}</p>
            </div>
          </div>
        )}

        {!loading && !educationContent && !insights && (
          <div className="text-center py-20">
            <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400">Complete your profile to see personalized education</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationView;