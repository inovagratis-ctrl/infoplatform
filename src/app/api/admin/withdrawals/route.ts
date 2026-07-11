import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const user = session.user as any
  if (user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const withdrawals = await prisma.withdrawal.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
    },
  })

  return NextResponse.json(withdrawals)
}
