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

  if (!user?.affiliate) {
    return NextResponse.json({ error: "Not an affiliate" }, { status: 403 })
  }

  const products = await prisma.product.findMany({
    where: { published: true },
    select: {
      id: true, title: true, price: true, slug: true,
      imageUrl: true, description: true, highlights: true,
      affiliateMaterials: true, productType: true, category: true,
      producer: { select: { producerName: true } },
    },
  })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || "https://nucleovip.com.br"
  const baseUrl = siteUrl.replace(/\/$/, "")

  const links = products.map((p) => ({
    productId: p.id,
    productTitle: p.title,
    price: p.price,
    slug: p.slug,
    imageUrl: p.imageUrl,
    description: p.description,
    highlights: p.highlights,
    productType: p.productType,
    category: p.category,
    producerName: p.producer?.producerName,
    affiliateMaterials: p.affiliateMaterials,
    salesUrl: p.slug ? `${baseUrl}/p/${p.slug}` : null,
    checkoutUrl: `${baseUrl}/checkout/${p.id}`,
    affiliateUrl: `${baseUrl}/checkout/${p.id}?ref=${user.affiliate!.referralCode}`,
    referralCode: user.affiliate!.referralCode,
  }))

  return NextResponse.json({ referralCode: user.affiliate.referralCode, links })
}
