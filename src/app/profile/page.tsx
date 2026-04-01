import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { User as UserIcon, Trophy, History, LogOut } from "lucide-react";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      totalScore: true,
      quizzesTaken: true,
      createdAt: true
    }
  });

  if (!user) {
    redirect("/login");
  }

  // Get global rank
  const usersWithHigherScore = await prisma.user.count({
    where: { totalScore: { gt: user.totalScore } }
  });
  
  const rank = usersWithHigherScore + 1;

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-8">Your Profile</h1>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="glass-effect p-8 rounded-3xl flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-gradient-brand rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(79,172,254,0.4)] mb-6">
            <UserIcon className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{user.name}</h2>
          <p className="text-zinc-400 mb-6">{user.email}</p>
          <div className="text-sm text-zinc-500">
            Member since {user.createdAt.toLocaleDateString()}
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="glass-effect p-8 rounded-3xl flex flex-col justify-center h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-20">
              <Trophy className="w-32 h-32 text-yellow-500" />
            </div>
            <div className="relative z-10">
              <p className="text-zinc-400 font-medium mb-2 uppercase tracking-widest text-sm">Global Rank</p>
              <div className="text-6xl font-black text-white mb-2">#{rank}</div>
              <p className="text-primary font-bold">{user.totalScore.toLocaleString()} Points</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-effect p-8 rounded-3xl">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <History className="w-5 h-5 text-primary" /> Activity Summary
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
            <div className="text-3xl font-black text-white mb-1">{user.quizzesTaken}</div>
            <div className="text-xs text-zinc-400 uppercase tracking-wider">Quizzes Forged</div>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
            <div className="text-3xl font-black text-emerald-400 mb-1">{user.quizzesTaken > 0 ? Math.round(user.totalScore / Math.max(1, user.quizzesTaken)) : 0}</div>
            <div className="text-xs text-zinc-400 uppercase tracking-wider">Avg Score</div>
          </div>
        </div>
      </div>
    </div>
  );
}
