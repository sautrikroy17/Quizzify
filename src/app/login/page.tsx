"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Zap, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch {
      setError('Google sign-in failed. Please try again.');
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegistering) {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to register');

        const signInRes = await signIn('credentials', {
          redirect: false,
          email: form.email,
          password: form.password
        });
        if (signInRes?.error) throw new Error(signInRes.error);
        router.push('/dashboard');
        router.refresh();
      } else {
        const res = await signIn('credentials', {
          redirect: false,
          email: form.email,
          password: form.password
        });
        if (res?.error) throw new Error(res.error);
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] -z-10" />

      <div className="w-full max-w-sm glass-effect rounded-3xl p-8 relative">
        <Link href="/" className="absolute top-6 left-6 text-zinc-500 hover:text-white transition-colors text-sm">
          ← Back
        </Link>

        <div className="flex justify-center mb-6 mt-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-[0_0_30px_rgba(79,172,254,0.4)]">
            <Zap className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-zinc-400 text-sm">
            {isRegistering ? 'Join Quizzify AI' : 'Sign in to your account'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-center text-sm font-medium mb-5">
            {error}
          </div>
        )}

        {/* Google Sign-In — Recommended */}
        <button
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-60 shadow-lg mb-4"
        >
          {googleLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
          ) : (
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          <span>{googleLoading ? 'Connecting...' : 'Continue with Google'}</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-zinc-600 text-xs">or use email</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {isRegistering && (
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 transition-colors text-sm"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 transition-colors text-sm"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 transition-colors text-sm"
            required
          />

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full mt-1 flex items-center justify-center gap-2 bg-gradient-brand hover:brightness-110 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 text-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isRegistering ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          {isRegistering ? "Already have an account?" : "Don't have an account?"}
          <button
            onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
            className="ml-2 text-primary hover:text-white transition-colors font-medium"
          >
            {isRegistering ? 'Sign In' : 'Register Here'}
          </button>
        </p>
      </div>
    </div>
  );
}
