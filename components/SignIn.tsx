import React, { useState } from 'react';
import { ChevronLeft, Mail, Lock } from 'lucide-react';
import { Logo } from '../constants';
import { supabase } from '../src/lib/supabase';
interface Props {
  onSignIn: (email: string) => void;
  onBack: () => void;
  onSignOut?: () => void; // { added }
}

const SignIn: React.FC<Props> = ({ onSignIn, onBack, onSignOut }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState(''); // { added }
	const [error, setError] = useState('');
	const [message, setMessage] = useState(''); // { added }
	const [loading, setLoading] = useState(false);
	const [mode, setMode] = useState<'signin' | 'signup'>('signin'); // { added }

	// new state to handle sign-in result & profile check
	const [signedInUser, setSignedInUser] = useState<{ id: string; email: string } | null>(null); // { added }
	const [profileExists, setProfileExists] = useState<boolean | null>(null); // { added }

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setMessage('');
		setLoading(true);
		setSignedInUser(null);
		setProfileExists(null);

		const cleanEmail = email.toLowerCase().trim();

		if (mode === 'signin') {
			// Sign in only
			const signIn = await supabase.auth.signInWithPassword({
				email: cleanEmail,
				password,
			});

			setLoading(false);

			if (!signIn.error && signIn.data.user) {
				const user = signIn.data.user;
				setMessage('Signed in. Checking account...');
				console.debug('[SignIn] signed in user:', user); // { added }

				// Check for an existing profile row to decide onboarding
				const { data: profile, error: profileError } = await supabase
					.from('profiles')
					.select('id')
					.eq('id', user.id)
					.single();

				console.debug('[SignIn] profile query result:', { profile, profileError }); // { added }

				if (!profileError && profile) {
					setMessage('Welcome back!');
					setProfileExists(true);
					// existing profile -> proceed immediately
					onSignIn(user.email!);
					return;
				}

				// No profile found -> try to auto-create a minimal profile so sign-in isn't blocked
				// IMPORTANT: use camelCase field names that match your UI / types (lastPeriodDate, cycleLength, etc.)
				const defaultProfile = {
    id: user.id,
    email: user.email,
    last_period_date: new Date().toISOString().slice(0, 10),
    cycle_length: 28,
    period_duration: 5,
    has_pcos: false,
    has_endometriosis: false,
    dietary_restrictions: []
};

				const { data: created, error: createError } = await supabase
					.from('profiles')
					.insert(defaultProfile)
					.select()
					.single();

				console.debug('[SignIn] profile create result:', { created, createError }); // { added }

				if (!createError || (createError && createError.message?.toLowerCase().includes('duplicate'))) {
					// Profile created (or already exists via race) -> proceed
					setMessage('Profile ready. Redirecting…');
					onSignIn(user.email!);
					return;
				}

				// If creation failed for some other reason, surface it and fall back to explicit continue option
				console.error('[SignIn] failed to create profile:', createError); // { added }
				setError(`Failed to create profile: ${createError?.message ?? 'unknown error'}. Check Supabase table column names and RLS policies.`);
				setSignedInUser({ id: user.id, email: user.email! });
				setProfileExists(false);
				return;
			}

			// Clear loading and show explicit messages—don't auto-create accounts
			setError(
				signIn.error?.message ??
					'Failed to sign in. If you don’t have an account, click "Start today" to create one.'
			);
			return;
		}

		// mode === 'signup' => Create account only
		// Validate confirm password before creating account
		if (password !== confirmPassword) {
			setLoading(false);
			setError('Passwords do not match.');
			return;
		}

		const signUp = await supabase.auth.signUp({
			email: cleanEmail,
			password,
		});

		setLoading(false);

		if (signUp.error) {
			setError(signUp.error.message);
			return;
		}

		// Account created (may require email confirm)
		setMessage('Account created. Check your email to verify if required.');
		// after creation, let the parent handle next steps
		onSignIn(cleanEmail);
	};

	const handleLogout = async () => {
		setError('');
		setMessage('');
		setLoading(true);
		try {
			const { error: signOutError } = await supabase.auth.signOut();
			setLoading(false);
			if (signOutError) {
				setError(signOutError.message);
				return;
			}
			setMessage('Signed out successfully.');
			setEmail('');
			setPassword('');
			setConfirmPassword('');
			setMode('signin');
			setSignedInUser(null);
			setProfileExists(null);

			// Notify parent or fall back to a reload to ensure UI/auth state updates
			if (typeof onSignOut === 'function') {
				onSignOut();
			} else {
				// If parent doesn't handle sign-out, reload to clear any global auth state
				window.location.reload();
			}
		} catch (err: any) {
			setLoading(false);
			setError(err?.message ?? 'Failed to sign out.');
		}
	};

	// Explicit continue button for users who signed in but have no profile
	const continueToOnboarding = () => {
		if (signedInUser) {
			onSignIn(signedInUser.email);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#FFF5F6] to-white flex flex-col">
			<div className="p-6 flex items-center justify-between">
				<button
					onClick={onBack}
					className="p-3 bg-white rounded-2xl shadow-sm flex items-center gap-2"
				>
					<ChevronLeft size={20} />
					<span>Back</span>
				</button>

				{/* Logout button */}
				<button
					onClick={handleLogout}
					className="p-3 bg-white rounded-2xl shadow-sm"
					disabled={loading} // { added }
				>
					{loading ? 'Signing out…' : 'Logout'}
				</button>
			</div>

			<div className="flex-1 flex flex-col justify-center px-8">
				<Logo size={32} className="mb-6" />
				<h1 className="text-4xl font-serif italic text-[#FF2D55] mb-4">
					{mode === 'signup' ? 'Create Account' : 'Sign In'}
				</h1>

				{/* Mode toggles */}
				<div className="flex gap-4 mb-6">
					<button
						onClick={() => setMode('signup')}
						className={`py-2 px-4 rounded-2xl ${
							mode === 'signup' ? 'bg-[#FF2D55] text-white' : 'bg-white'
						}`}
					>
						Start today
					</button>
					<button
						onClick={() => setMode('signin')}
						className={`py-2 px-4 rounded-2xl ${
							mode === 'signin' ? 'bg-[#FF2D55] text-white' : 'bg-white'
						}`}
					>
						Sign in
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full p-4 rounded-2xl border"
					/>

					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full p-4 rounded-2xl border"
					/>

					{/* confirm password only shown in signup mode */}
					{mode === 'signup' && (
						<input
							type="password"
							placeholder="Confirm password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							className="w-full p-4 rounded-2xl border"
						/>
					)}

					{(error || message) && (
						<div className={`${error ? 'text-red-600' : 'text-green-600'} text-sm`}>
							{error || message}
						</div>
					)}

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-[#FF2D55] text-white py-4 rounded-2xl"
					>
						{loading ? 'Loading…' : mode === 'signup' ? 'Create account' : 'Continue'}
					</button>
				</form>

				{/* If user signed in but profile is missing, require explicit continue */}
				{signedInUser && profileExists === false && (
					<div className="mt-6">
						<div className="text-sm mb-2 text-gray-700">
							It looks like your account doesn't have a profile yet.
						</div>
						<button
							onClick={continueToOnboarding}
							className="w-full bg-[#FF2D55] text-white py-3 rounded-2xl"
						>
							Continue to onboarding
						</button>
					</div>
				)}

				{/* If sign-in failed because user doesn't exist, show explicit invite to sign up */}
				{error &&
					error.toLowerCase().includes('user') && (
						<div className="mt-4 text-sm">
							<span>Don't have an account?</span>
							<button
								onClick={() => setMode('signup')}
								className="ml-2 text-[#FF2D55] underline"
							>
								Start today
							</button>
						</div>
					)}
			</div>
		</div>
	);
};

export default SignIn;
