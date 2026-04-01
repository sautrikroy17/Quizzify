import Link from 'next/link';
import { User, LogOut, LayoutDashboard, Trophy, Zap } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/nextauth';
import LogoutButton from './LogoutButton';

export default async function TopNav() {
  const session = await getServerSession(authOptions);
  
  const isLoggedIn = !!session;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Left: Branding & Core Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center shadow-[0_0_15px_rgba(79,172,254,0.3)] group-hover:shadow-[0_0_25px_rgba(79,172,254,0.5)] transition-all">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Quizzify</span>
          </Link>

          {isLoggedIn && (
            <div className="hidden md:flex items-center gap-1">
              <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-md hover:bg-white/5 flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <Link href="/forge" className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-md hover:bg-white/5 flex items-center gap-2">
                <Zap className="w-4 h-4" /> Forge Quiz
              </Link>
              <Link href="/leaderboard" className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-md hover:bg-white/5 flex items-center gap-2">
                <Trophy className="w-4 h-4" /> Leaderboard
              </Link>
            </div>
          )}
        </div>

        {/* Right: Auth Profile */}
        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <Link 
              href="/login" 
              className="px-5 py-2 text-sm font-medium text-black bg-white rounded-lg hover:bg-zinc-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              Sign In
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/profile" className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium cursor-pointer">
                <User className="w-4 h-4 text-primary" />
                <span className="text-zinc-200">{session?.user?.name || 'User'}</span>
              </Link>
              <LogoutButton />
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}
