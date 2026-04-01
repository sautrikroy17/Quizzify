import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Zap, Target, History, Trophy } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      quizzes: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!user) redirect("/login");

  const allTopicsRaw = user.quizzes.flatMap(q => JSON.parse(q.weakTopics || "[]"));
  const topicCounts = allTopicsRaw.reduce((acc, t) => {
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedWeakTopics = (Object.entries(topicCounts) as [string, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(entry => entry[0]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user.name}</h1>
          <p className="text-zinc-400">Here's your latest performance data.</p>
        </div>
        <Link href="/generate" className="flex items-center gap-2 bg-gradient-brand hover:brightness-110 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(79,172,254,0.3)]">
          <Zap className="w-5 h-5" /> Generate New Quiz
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="glass-effect p-6 rounded-2xl">
          <div className="text-zinc-400 mb-2 flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" /> Total Score</div>
          <div className="text-4xl font-black text-white">{user.totalScore}</div>
        </div>
        <div className="glass-effect p-6 rounded-2xl">
          <div className="text-zinc-400 mb-2 flex items-center gap-2"><History className="w-5 h-5 text-primary" /> Quizzes Taken</div>
          <div className="text-4xl font-black text-white">{user.quizzesTaken}</div>
        </div>
        <div className="glass-effect p-6 rounded-2xl border-red-500/20 bg-red-500/5">
          <div className="text-zinc-400 mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-red-500" /> Highest Priority Topics</div>
          <div className="flex flex-wrap gap-2">
            {sortedWeakTopics.length > 0 ? (
              sortedWeakTopics.map(t => (
                <span key={t} className="px-2 py-1 bg-red-500/10 text-red-300 rounded text-xs font-medium">{t}</span>
              ))
            ) : (
              <span className="text-zinc-500 text-sm">No weak points found yet!</span>
            )}
          </div>
        </div>
      </div>

      <div className="glass-effect rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Recent History</h2>
        {user.quizzes.length > 0 ? (
          <div className="divide-y divide-white/5">
            {user.quizzes.map(quiz => (
              <div key={quiz.id} className="py-4 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-white mb-1">
                    {quiz.mode.charAt(0).toUpperCase() + quiz.mode.slice(1)} • {quiz.difficulty.toUpperCase()}
                  </div>
                  <div className="text-zinc-500 text-sm">{quiz.createdAt.toLocaleDateString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-primary">{quiz.percentage}%</div>
                  <div className="text-zinc-400 text-xs">{quiz.score} / {quiz.total}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-zinc-500">
            You haven't generated any quizzes yet.
          </div>
        )}
      </div>
    </div>
  );
}
