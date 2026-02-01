
import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

interface SignInProps {
  onSignIn: (email: string) => void;
  onBack: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignIn, onBack }) => {
  const [email, setEmail] = useState('');

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="bg-[#FF2D55] p-10 flex flex-col justify-between h-[45vh] relative rounded-b-[4rem] shadow-2xl">
        <button onClick={onBack} className="text-white flex items-center gap-2 font-medium opacity-80 hover:opacity-100 transition-opacity">
          <ArrowLeft size={18} /> Back to Home
        </button>
        
        <div className="mb-8">
          <h2 className="text-5xl font-serif text-white mb-4">Start your journey to hormone harmony.</h2>
          <p className="text-white/80 text-lg leading-relaxed max-w-xs">
            Join thousands of women who have unlocked their best selves through cycle syncing.
          </p>
        </div>

        <div className="absolute -bottom-8 left-10 right-10">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-3xl flex items-center gap-4">
            <div className="bg-white p-2.5 rounded-2xl">
              <ShieldCheck className="text-[#FF2D55]" size={24} />
            </div>
            <div>
              <p className="text-white font-bold text-sm">100% Private</p>
              <p className="text-white/60 text-xs">Your health data is encrypted and never shared.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-10 pt-16 flex flex-col">
        <h3 className="text-3xl font-bold mb-1">Welcome back</h3>
        <p className="text-[#FF2D55] font-medium mb-10">We've missed you! Enter your details below.</p>

        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onSignIn(email); }}>
          <div>
            <label className="block text-[#1A1A1A] text-sm font-bold mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-200" size={20} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#FFF5F6] border-none rounded-2xl py-4 pl-12 pr-4 text-[#1A1A1A] placeholder:text-pink-200 focus:ring-2 focus:ring-[#FF2D55] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#1A1A1A] text-sm font-bold mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-200" size={20} />
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full bg-[#FFF5F6] border-none rounded-2xl py-4 pl-12 pr-4 text-[#1A1A1A] placeholder:text-pink-200 focus:ring-2 focus:ring-[#FF2D55] transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-[#FF2D55] text-sm font-bold">Forgot password?</button>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#FF2D55] text-white rounded-3xl py-5 font-bold flex items-center justify-center gap-2 shadow-xl shadow-pink-100 hover:scale-[1.01] transition-transform"
          >
            Sign In <ArrowRight size={20} />
          </button>
        </form>

        <p className="text-center mt-12 text-sm text-gray-400 font-medium">
          Don't have an account? <span className="text-[#FF2D55] font-bold cursor-pointer">Sign up</span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
