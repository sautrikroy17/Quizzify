import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// One-time admin cleanup route — DELETE /api/admin/cleanup
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  // Simple one-time admin token — will be deleted after use
  if (token !== "quizzify-admin-cleanup-2025") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deleted = await prisma.user.deleteMany({
    where: {
      OR: [
        // Delete users with offensive names
        { name: { contains: "chutia", mode: "insensitive" } },
        // Delete users with offensive patterns in email
        { email: { contains: "chutia", mode: "insensitive" } },
      ],
    },
  });

  return NextResponse.json({
    message: `Deleted ${deleted.count} user(s) successfully.`,
    deletedCount: deleted.count,
  });
}
