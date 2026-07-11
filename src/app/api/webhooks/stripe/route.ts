import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature") || ""

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const stripeSession = event.data.object as any
    const { userId, productId, affiliateId } = stripeSession.metadata

    const order = await prisma.order.findFirst({
      where: { paymentId: stripeSession.id },
    })

    if (order) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "completed" },
      })

      const product = await prisma.product.findUnique({ where: { id: productId } })
      const expiresAt = product?.isSubscription && product?.subscriptionDays
        ? new Date(Date.now() + product.subscriptionDays * 86400000)
        : null

      await prisma.purchase.create({
        data: { userId, productId, expiresAt },
      })

      if (product?.producerId) {
        let producerShare = product.price * 0.95

        if (affiliateId) {
          const affiliate = await prisma.affiliate.findUnique({
            where: { id: affiliateId },
          })
          if (affiliate) {
            const commission = product.price * (affiliate.commissionRate / 100)
            producerShare -= commission
            await prisma.affiliateSale.create({
              data: {
                affiliateId,
                orderId: order.id,
                commission,
                status: "pending",
              },
            })
          }
        }

        await prisma.producerEarning.create({
          data: {
            producerId: product.producerId,
            orderId: order.id,
            amount: producerShare,
            status: "pending",
          },
        })
      }
    }
  }

  return NextResponse.json({ received: true })
}
