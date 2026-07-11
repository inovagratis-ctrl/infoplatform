import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { session_id } = await req.json()
    if (!session_id) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 })
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id)
    if (checkoutSession.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
    }

    const { userId, productId } = checkoutSession.metadata || {}
    if (!userId || !productId) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 })
    }

    const existingPurchase = await prisma.purchase.findFirst({
      where: { userId, productId },
    })
    if (existingPurchase) {
      return NextResponse.json({ success: true, alreadyExists: true })
    }

    await prisma.order.updateMany({
      where: { paymentId: session_id },
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
      const order = await prisma.order.findFirst({ where: { paymentId: session_id } })
      if (order) {
        let producerShare = product.price * 0.95

        if (order.affiliateId) {
          const affiliate = await prisma.affiliate.findUnique({
            where: { id: order.affiliateId },
          })
          if (affiliate) {
            const commission = product.price * (affiliate.commissionRate / 100)
            producerShare -= commission
            await prisma.affiliateSale.create({
              data: {
                affiliateId: order.affiliateId,
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

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Confirm purchase error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
