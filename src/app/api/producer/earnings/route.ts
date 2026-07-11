import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = session.user as any
  if (user.role !== "producer" && user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const where = user.role === "producer" ? { producerId: user.id } : {}

  const earnings = await prisma.producerEarning.findMany({
    where,
    include: {
      order: {
        include: { product: true, user: { select: { name: true, email: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  const totals = await prisma.producerEarning.aggregate({
    where,
    _sum: { amount: true },
    _count: true,
  })

  return NextResponse.json({
    earnings,
    totalEarned: totals._sum.amount || 0,
    totalSales: totals._count,
  })
}
