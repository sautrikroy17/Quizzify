import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { score, total, mode, difficulty, weakTopics } = await req.json();

    const percentage = Math.round((score / total) * 100);

    const quiz = await prisma.quiz.create({
      data: {
        userId,
        score,
        total,
        percentage,
        mode,
        difficulty,
        weakTopics: JSON.stringify(weakTopics || []),
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        totalScore: { increment: score * 10 * (difficulty === 'hard' ? 2 : difficulty === 'medium' ? 1.5 : 1) },
        quizzesTaken: { increment: 1 },
      },
    });

    return NextResponse.json({ success: true, quizId: quiz.id });
  } catch (error: any) {
    console.error("Failed to save result:", error);
    return NextResponse.json({ error: "Failed to save result" }, { status: 500 });
  }
}
