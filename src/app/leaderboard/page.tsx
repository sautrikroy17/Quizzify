import { prisma } from "@/lib/prisma";
import { Trophy, Medal } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const users = await prisma.user.findMany({
    where: {
      NOT: {
        name: {
          equals: 'chutia',
          mode: 'insensitive'
        }
      }
    },
    orderBy: { totalScore: 'desc' },
    take: 50
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-yellow-500/20 text-yellow-500 rounded-2xl mx-auto flex items-center justify-center mb-6">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Global Leaderboard</h1>
        <p className="text-zinc-400">Rankings based on total weighted score across all quizzes.</p>
      </div>

      <div className="max-w-3xl mx-auto glass-effect rounded-[2rem] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/5">
            <tr>
              <th className="p-6 text-zinc-400 font-medium">Rank</th>
              <th className="p-6 text-zinc-400 font-medium">User</th>
              <th className="p-6 text-zinc-400 font-medium whitespace-nowrap text-right">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((user, idx) => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors">
                <td className="p-6 text-white font-bold text-lg w-20">
                  {idx === 0 && <span className="text-yellow-400">1st</span>}
                  {idx === 1 && <span className="text-zinc-300">2nd</span>}
                  {idx === 2 && <span className="text-amber-600">3rd</span>}
                  {idx > 2 && <span className="text-zinc-500">#{idx + 1}</span>}
                </td>
                <td className="p-6">
                  <div className="font-semibold text-white">{user.name}</div>
                  <div className="text-sm text-zinc-500">{user.quizzesTaken} Quizzes Forged</div>
                </td>
                <td className="p-6 text-right font-mono font-black text-primary text-xl">
                  {user.totalScore.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
