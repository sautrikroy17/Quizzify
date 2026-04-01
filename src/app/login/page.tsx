"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Zap, CircleUser, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({ name: '', email: '', password: '' });

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
        
        // Auto sign-in after register
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
        <Link href="/" className="absolute top-6 left-6 text-zinc-500 hover:text-white transition-colors">
          ← Back
        </Link>
        
        <div className="flex justify-center mb-6 mt-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-[0_0_30px_rgba(79,172,254,0.4)]">
            <Zap className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">{isRegistering ? 'Create Account' : 'Welcome Back'}</h1>
          <p className="text-zinc-400 text-sm">Sign in to your Quizzify account</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-center text-sm font-medium mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 transition-colors"
                required
              />
            </div>
          )}
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 transition-colors"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 transition-colors"
              required
            />
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-brand hover:brightness-110 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-200 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isRegistering ? 'Register' : 'Sign In')}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-500">
          {isRegistering ? "Already have an account?" : "Don't have an account?"}
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="ml-2 text-primary hover:text-white transition-colors font-medium"
          >
            {isRegistering ? 'Sign In' : 'Register Here'}
          </button>
        </p>
      </div>
    </div>
  );
}
