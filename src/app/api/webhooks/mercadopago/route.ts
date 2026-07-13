import { NextResponse } from "next/server"
import { payment } from "@/lib/mercadopago"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (body.type === "payment") {
      const paymentId = body.data?.id
      if (!paymentId) {
        return NextResponse.json({ error: "No payment ID" }, { status: 400 })
      }

      const paymentData = await payment.get({ id: paymentId })

      if (paymentData.status === "approved") {
        const externalRef = paymentData.external_reference || ""
        const parts = externalRef.split("-")
        const userId = parts[0]
        const productId = parts[1]
        const affiliateId = parts[2] || null

        const order = await prisma.order.findFirst({
          where: {
            paymentId: paymentId.toString(),
            status: "pending",
          },
        })

        if (order) {
          await prisma.order.update({
            where: { id: order.id },
            data: { status: "completed" },
          })

          await prisma.purchase.create({
            data: {
              userId: order.userId,
              productId: order.productId,
            },
          })

          if (affiliateId) {
            const affiliate = await prisma.affiliate.findUnique({
              where: { id: affiliateId },
            })
            if (affiliate) {
              const commission = order.amount * 0.1
              await prisma.affiliateCommission.create({
                data: {
                  affiliateId: affiliate.id,
                  orderId: order.id,
                  amount: commission,
                  status: "pending",
                },
              })
            }
          }
        }
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook error" }, { status: 500 })
  }
}
