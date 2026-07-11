import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { affiliate: true },
  })

  if (!user?.affiliate) {
    return NextResponse.json({ error: "Not an affiliate" }, { status: 403 })
  }

  const sales = await prisma.affiliateSale.findMany({
    where: { affiliateId: user.affiliate.id },
    include: {
      order: {
        include: { product: { select: { title: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  const totals = await prisma.affiliateSale.aggregate({
    where: { affiliateId: user.affiliate.id },
    _sum: { commission: true },
    _count: true,
  })

  return NextResponse.json({
    sales,
    totalCommissions: totals._sum.commission || 0,
    totalSales: totals._count,
    commissionRate: user.affiliate.commissionRate,
  })
}
