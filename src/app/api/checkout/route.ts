import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { preference } from "@/lib/mercadopago"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Faça login primeiro" }, { status: 401 })
    }

    const { productId, ref } = await req.json()

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    const existingPurchase = await prisma.purchase.findFirst({
      where: { userId: user.id, productId: product.id },
    })
    if (existingPurchase) {
      return NextResponse.json({ error: "Você já comprou este produto" }, { status: 400 })
    }

    let affiliateId: string | null = null
    if (ref) {
      const affiliate = await prisma.affiliate.findUnique({ where: { referralCode: ref } })
      if (affiliate && affiliate.userId !== user.id) {
        affiliateId = affiliate.id
      }
    }

    const externalRef = `${user.id}-${product.id}-${affiliateId || ""}`

    const result = await preference.create({
      body: {
        items: [
          {
            id: product.id,
            title: product.title,
            quantity: 1,
            unit_price: product.price,
            currency_id: "BRL",
          },
        ],
        payer: {
          email: user.email!,
          name: user.name || "Cliente",
        },
        external_reference: externalRef,
        back_urls: {
          success: `${process.env.APP_URL}/success`,
          failure: `${process.env.APP_URL}/checkout/${productId}`,
          pending: `${process.env.APP_URL}/success`,
        },
        auto_return: "approved",
        notification_url: `${process.env.APP_URL}/api/webhooks/mercadopago`,
      },
    })

    await prisma.order.create({
      data: {
        userId: user.id,
        productId: product.id,
        amount: product.price,
        status: "pending",
        paymentId: result.id?.toString() || "",
        paymentMethod: "mercadopago",
        affiliateId: affiliateId,
      },
    })

    return NextResponse.json({
      checkout_url: result.init_point,
    })
  } catch (error: any) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: error.message || "Erro ao processar pagamento" }, { status: 500 })
  }
}