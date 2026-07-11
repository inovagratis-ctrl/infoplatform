import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const admin = session.user as any
  if (admin.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { status: newStatus } = await req.json()
  if (newStatus !== "approved" && newStatus !== "rejected") {
    return NextResponse.json({ error: "Status inválido" }, { status: 400 })
  }

  const withdrawal = await prisma.withdrawal.findUnique({
    where: { id: params.id },
    include: { user: { include: { affiliate: true } } },
  })
  if (!withdrawal) return NextResponse.json({ error: "Saque não encontrado" }, { status: 404 })
  if (withdrawal.status !== "pending") {
    return NextResponse.json({ error: "Saque já processado" }, { status: 400 })
  }

  const now = new Date()

  const updated = await prisma.withdrawal.update({
    where: { id: params.id },
    data: {
      status: newStatus,
      processedAt: now,
      processedById: admin.id,
    },
  })

  if (newStatus === "approved") {
    if (withdrawal.type === "producer") {
      await prisma.producerEarning.updateMany({
        where: { producerId: withdrawal.userId, status: "pending" },
        data: { status: "paid", paidAt: now },
      })
    } else {
      await prisma.affiliateSale.updateMany({
        where: { affiliateId: withdrawal.user.affiliate!.id, status: "pending" },
        data: { status: "paid", paidAt: now },
      })
    }
  }

  return NextResponse.json(updated)
}
