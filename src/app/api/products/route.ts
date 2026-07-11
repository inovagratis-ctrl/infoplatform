import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(products)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const product = await prisma.product.create({
    data: {
      title: body.title,
      description: body.description,
      price: parseFloat(body.price),
      comparePrice: body.comparePrice ? parseFloat(body.comparePrice) : null,
      imageUrl: body.imageUrl,
      contentUrl: body.contentUrl,
      contentType: body.contentType || "video",
      isSubscription: body.isSubscription || false,
      subscriptionDays: body.subscriptionDays ? parseInt(body.subscriptionDays) : null,
      published: body.published || false,
    },
  })
  return NextResponse.json(product)
}
