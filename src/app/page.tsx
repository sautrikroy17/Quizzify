import Link from 'next/link';
import { ArrowRight, Zap, Target, Brain } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/nextauth';

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-1/4 -right-64 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute -bottom-32 -left-64 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] -z-10" />

      <main className="container mx-auto px-6 text-center z-10 py-20 mt-10">
        <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter text-transparent bg-clip-text bg-gradient-brand leading-tight">
          Master any subject.<br/>In seconds.
        </h1>
        <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-12 font-medium">
          Upload any PDF or document and let Quizzify AI forge intelligent assessments, track your weak spots, and push you up the leaderboard.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href={isLoggedIn ? "/dashboard" : "/login"}
            className="flex items-center gap-2 bg-white hover:bg-zinc-200 text-black px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105"
          >
            Start Forging <ArrowRight className="w-5 h-5" />
          </Link>
          <a href="#features" className="px-8 py-4 rounded-full font-bold text-lg text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
            View Features
          </a>
        </div>

        {/* Feature Grid */}
        <div id="features" className="grid md:grid-cols-3 gap-8 mt-32 max-w-5xl mx-auto text-left">
          <div className="glass-effect p-8 rounded-3xl">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Instant Generation</h3>
            <p className="text-zinc-400">Zero loading screens. Our AI rips through documents in seconds to extract core concepts.</p>
          </div>
          <div className="glass-effect p-8 rounded-3xl">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Adaptive Insights</h3>
            <p className="text-zinc-400">Identify exactly where you fail. Our dashboard isolates your weak topics automatically.</p>
          </div>
          <div className="glass-effect p-8 rounded-3xl">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Global Leaderboard</h3>
            <p className="text-zinc-400">Compete across campus. High scores are ranked globally ensuring you stay motivated.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
