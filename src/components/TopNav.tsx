import Link from 'next/link';
import Image from 'next/image';
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
            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(79,172,254,0.3)] group-hover:shadow-[0_0_25px_rgba(79,172,254,0.5)] transition-all">
              <Image src="/logo.png" alt="Quizzify Logo" width={32} height={32} className="object-cover" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Quizzify</span>
          </Link>

          {isLoggedIn && (
            <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-[#09090b]/95 border-t border-white/5 py-3 px-2 md:relative md:bottom-auto md:left-auto md:right-auto md:z-auto md:flex md:justify-start md:bg-transparent md:border-none md:py-0 md:px-0 gap-1 mt-auto">
              <Link href="/dashboard" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 px-2 md:px-4 py-2 text-xs md:text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-md hover:bg-white/5">
                <LayoutDashboard className="w-5 h-5 md:w-4 md:h-4" /> <span className="hidden md:inline">Dashboard</span>
              </Link>
              <Link href="/forge" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 px-2 md:px-4 py-2 text-xs md:text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-md hover:bg-white/5">
                <Zap className="w-5 h-5 md:w-4 md:h-4" /> <span className="hidden md:inline">Forge</span>
              </Link>
              <Link href="/leaderboard" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 px-2 md:px-4 py-2 text-xs md:text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-md hover:bg-white/5">
                <Trophy className="w-5 h-5 md:w-4 md:h-4" /> <span className="hidden md:inline">Leaderboard</span>
              </Link>
              {/* Profile icon in mobile nav explicitly for small screens since top right gets crowded */}
              <Link href="/profile" className="flex flex-col md:hidden items-center gap-1 px-2 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors rounded-md hover:bg-white/5">
                <User className="w-5 h-5 text-primary" /> <span>Profile</span>
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
