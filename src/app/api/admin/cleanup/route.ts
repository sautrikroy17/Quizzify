import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// One-time admin cleanup route — DELETE /api/admin/cleanup
// This will be removed after use
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.NEXTAUTH_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Delete offensive/test users
  const deleted = await prisma.user.deleteMany({
    where: {
      name: {
        contains: "chutia",
        mode: "insensitive",
      },
    },
  });

  return NextResponse.json({
    message: `Deleted ${deleted.count} user(s) successfully.`,
  });
}
