import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { stripe } from "@/lib/stripe"
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

    const priceInCents = Math.round(product.price * 100)

    const lineItems = [{
      price_data: {
        currency: "brl",
        product_data: {
          name: product.title,
          description: product.description.substring(0, 100),
          images: product.imageUrl ? [product.imageUrl] : [],
        },
        unit_amount: priceInCents,
      },
      quantity: 1,
    }]

    const stripeSession = await stripe.checkout.sessions.create({
      customer_email: user.email!,
      line_items: lineItems,
      mode: "payment",
      payment_method_types: ["card", "boleto"],
      payment_method_options: {
        boleto: {
          expires_after_days: 3,
        },
      },
      invoice_creation: { enabled: true },
      success_url: `${process.env.APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/checkout/${productId}?canceled=true`,
      metadata: {
        userId: user.id,
        productId: product.id,
        affiliateId: affiliateId || "",
      },
    })

    // Create order as pending
    await prisma.order.create({
      data: {
        userId: user.id,
        productId: product.id,
        amount: product.price,
        status: "pending",
        paymentId: stripeSession.id,
        paymentMethod: "stripe",
        affiliateId: affiliateId,
      },
    })

    return NextResponse.json({ url: stripeSession.url })
  } catch (error: any) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: error.message || "Erro ao processar pagamento" }, { status: 500 })
  }
}
