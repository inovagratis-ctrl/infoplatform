import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = session.user as any
  const product = await prisma.product.findUnique({ where: { id: params.id } })
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (user.role === "producer" && product.producerId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const data: any = {
    title: body.title,
    description: body.description,
    price: parseFloat(body.price),
    comparePrice: body.comparePrice ? parseFloat(body.comparePrice) : null,
    imageUrl: body.imageUrl,
    contentUrl: body.contentUrl,
    contentType: body.contentType,
    productType: body.productType || "course",
    category: body.category || null,
    tags: body.tags || null,
    highlights: body.highlights || null,
    targetAudience: body.targetAudience || null,
    requirements: body.requirements || null,
    installments: body.installments ? parseInt(body.installments) : 1,
    isSubscription: body.isSubscription,
    subscriptionDays: body.subscriptionDays ? parseInt(body.subscriptionDays) : null,
    published: body.published,
  }
  if (body.slug) data.slug = body.slug
  const updated = await prisma.product.update({
    where: { id: params.id },
    data,
  })
  return NextResponse.json(updated)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = session.user as any
  const product = await prisma.product.findUnique({ where: { id: params.id } })
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (user.role === "producer" && product.producerId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  await prisma.product.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
