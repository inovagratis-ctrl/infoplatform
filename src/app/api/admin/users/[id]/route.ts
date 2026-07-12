import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      _count: { select: { products: true, orders: true, purchases: true } },
      affiliate: { select: { referralCode: true, commissionRate: true } },
    },
  })

  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json(user)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { name, email, cpf, phone, role } = body

  if (!name || !email || !role) {
    return NextResponse.json({ error: "Nome, email e papel sao obrigatorios" }, { status: 400 })
  }

  const cleanCPF = cpf ? cpf.replace(/\D/g, "") : null

  if (cleanCPF) {
    const existingCPF = await prisma.user.findFirst({
      where: { cpf: cleanCPF, id: { not: params.id } },
    })
    if (existingCPF) {
      return NextResponse.json({ error: "CPF ja cadastrado" }, { status: 400 })
    }
  }

  const existingEmail = await prisma.user.findFirst({
    where: { email, id: { not: params.id } },
  })
  if (existingEmail) {
    return NextResponse.json({ error: "Email ja cadastrado" }, { status: 400 })
  }

  const updated = await prisma.user.update({
    where: { id: params.id },
    data: {
      name,
      email,
      cpf: cleanCPF,
      phone: phone || null,
      role,
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: params.id },
  })

  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if ((session.user as any)?.id === params.id) {
    return NextResponse.json({ error: "Nao e possivel excluir seu proprio usuario" }, { status: 400 })
  }

  const affiliateRecord = await prisma.affiliate.findUnique({ where: { userId: params.id } })

  if (affiliateRecord) {
    await prisma.affiliateSale.deleteMany({ where: { affiliateId: affiliateRecord.id } })
    await prisma.affiliate.delete({ where: { userId: params.id } })
  }

  await prisma.producerEarning.deleteMany({ where: { producerId: params.id } })
  await prisma.withdrawal.deleteMany({ where: { userId: params.id } })
  await prisma.withdrawal.deleteMany({ where: { processedById: params.id } })
  await prisma.affiliateSale.deleteMany({ where: { order: { userId: params.id } } })
  await prisma.order.deleteMany({ where: { userId: params.id } })
  await prisma.purchase.deleteMany({ where: { userId: params.id } })

  const userProducts = await prisma.product.findMany({ where: { producerId: params.id }, select: { id: true } })
  for (const product of userProducts) {
    await prisma.affiliateSale.deleteMany({ where: { order: { productId: product.id } } })
    await prisma.producerEarning.deleteMany({ where: { order: { productId: product.id } } })
    await prisma.order.deleteMany({ where: { productId: product.id } })
    await prisma.purchase.deleteMany({ where: { productId: product.id } })
  }
  await prisma.product.deleteMany({ where: { producerId: params.id } })

  await prisma.user.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
