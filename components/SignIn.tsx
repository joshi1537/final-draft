import React, { useState } from 'react';
import { ChevronLeft, Mail, Lock } from 'lucide-react';
import { Logo } from '../constants';

interface Props {
  onSignIn: (email: string) => void;
  onBack: () => void;
}

const SignIn: React.FC<Props> = ({ onSignIn, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate email
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // For now, we're not validating password since this is a demo
    // In production, you'd validate password and authenticate with a backend
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Success - proceed to onboarding
    onSignIn(email.toLowerCase().trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F6] to-white flex flex-col">
      {/* Back Button */}
      <div className="p-6">
        <button 
          onClick={onBack}
          className="p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-gray-600"
        >
          <ChevronLeft size={20} />
          <span className="font-medium">Back</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-8 pb-12">
        <div className="mb-8">
          <Logo size={32} className="mb-6" />
          <h1 className="text-4xl font-serif italic text-[#FF2D55] mb-3">Create Account</h1>
          <p className="text-gray-500">Sign in to continue your hormone harmony journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="your.email@example.com"
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-pink-100 rounded-2xl focus:border-[#FF2D55] focus:outline-none text-gray-700 placeholder-gray-300"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-pink-100 rounded-2xl focus:border-[#FF2D55] focus:outline-none text-gray-700 placeholder-gray-300"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm">
              {error}
            </div>
          )}

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-[#FF2D55] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#E02549] transition-colors shadow-lg shadow-pink-200"
          >
            Sign In
          </button>
        </form>

        {/* Demo Note */}
        <div className="mt-8 p-4 bg-pink-50 rounded-2xl border border-pink-100">
          <p className="text-xs text-gray-600 text-center">
            <span className="font-bold text-[#FF2D55]">Important:</span> Any email and password (6+ chars) is required
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;