import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = session.user as any
  if (user.role !== "producer" && user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const where = user.role === "producer" ? { producerId: user.id } : {}
  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(products)
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = session.user as any
  if (user.role !== "producer" && user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const baseSlug = body.slug || slugify(body.title)
  let slug = baseSlug
  let counter = 1
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`
  }

  const product = await prisma.product.create({
    data: {
      title: body.title,
      description: body.description,
      price: parseFloat(body.price),
      comparePrice: body.comparePrice ? parseFloat(body.comparePrice) : null,
      imageUrl: body.imageUrl,
      contentUrl: body.contentUrl,
      contentType: body.contentType || "video",
      productType: body.productType || "course",
      category: body.category || null,
      tags: body.tags || null,
      highlights: body.highlights || null,
      targetAudience: body.targetAudience || null,
      requirements: body.requirements || null,
      slug,
      installments: body.installments ? parseInt(body.installments) : 1,
      isSubscription: body.isSubscription || false,
      subscriptionDays: body.subscriptionDays ? parseInt(body.subscriptionDays) : null,
      published: body.published || false,
      producerId: user.role === "producer" ? user.id : body.producerId || null,
    },
  })
  return NextResponse.json(product)
}
