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
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const [withdrawals, producerPending, affiliatePending] = await Promise.all([
    prisma.withdrawal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.producerEarning.aggregate({
      where: { producerId: user.id, status: "pending" },
      _sum: { amount: true },
    }),
    user.affiliate
      ? prisma.affiliateSale.aggregate({
          where: { affiliateId: user.affiliate.id, status: "pending" },
          _sum: { commission: true },
        })
      : Promise.resolve({ _sum: { commission: 0 } }),
  ])

  const producerBalance = producerPending._sum.amount || 0
  const affiliateBalance = affiliatePending._sum.commission || 0

  return NextResponse.json({
    withdrawals,
    producerBalance,
    affiliateBalance,
    pixKey: user.pixKey,
    pixKeyType: user.pixKeyType,
  })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { affiliate: true },
  })
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const { amount, type, pixKey, pixKeyType } = await req.json()

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "Valor inválido" }, { status: 400 })
  }
  if (!pixKey || !pixKeyType) {
    return NextResponse.json({ error: "Informe a chave PIX" }, { status: 400 })
  }
  if (type !== "producer" && type !== "affiliate") {
    return NextResponse.json({ error: "Tipo inválido" }, { status: 400 })
  }

  const validTypes = ["cpf", "cnpj", "email", "phone", "random"]
  if (!validTypes.includes(pixKeyType)) {
    return NextResponse.json({ error: "Tipo de chave PIX inválido" }, { status: 400 })
  }

  if (type === "producer" && user.role !== "producer" && user.role !== "admin") {
    return NextResponse.json({ error: "Você não é um produtor" }, { status: 403 })
  }
  if (type === "affiliate" && !user.affiliate) {
    return NextResponse.json({ error: "Você não é um afiliado" }, { status: 403 })
  }

  const fee = 3.19
  const grossAmount = amount + fee

  let available = 0
  if (type === "producer") {
    const agg = await prisma.producerEarning.aggregate({
      where: { producerId: user.id, status: "pending" },
      _sum: { amount: true },
    })
    available = agg._sum.amount || 0
  } else {
    const agg = await prisma.affiliateSale.aggregate({
      where: { affiliateId: user.affiliate!.id, status: "pending" },
      _sum: { commission: true },
    })
    available = agg._sum.commission || 0
  }
  if (grossAmount > available) {
    return NextResponse.json({
      error: `Saldo insuficiente. Valor solicitado: R$ ${amount.toFixed(2)} + taxa de R$ ${fee.toFixed(2)} = R$ ${grossAmount.toFixed(2)}. Disponível: R$ ${available.toFixed(2)}`,
    }, { status: 400 })
  }

  const withdrawal = await prisma.withdrawal.create({
    data: {
      userId: user.id,
      amount,
      fee,
      grossAmount,
      type,
      pixKey,
      pixKeyType,
      status: "pending",
    },
  })

  await prisma.user.update({
    where: { id: user.id },
    data: { pixKey, pixKeyType },
  })

  return NextResponse.json(withdrawal, { status: 201 })
}
