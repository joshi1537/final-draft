// Small helper and example usage. Prefer server-side usage for secrets.

const getGeminiKey = (): string => {
  let viteKey = '';
  try {
    viteKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  } catch {
    viteKey = '';
  }
  const procEnv = (typeof process !== 'undefined' ? (process.env as any) : undefined);
  return (viteKey || procEnv?.VITE_GEMINI_API_KEY || procEnv?.VITE_API_KEY || procEnv?.API_KEY || procEnv?.GEMINI_API_KEY || '') as string;
};

export const GEMINI_API_KEY = getGeminiKey();