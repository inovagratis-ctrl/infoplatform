import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nucleovip.com.br"

export default async function sitemap() {
  const products = await prisma.product.findMany({
    where: { published: true },
    select: { id: true, slug: true, updatedAt: true },
  })

  const staticPages = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${siteUrl}/quem-somos`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${siteUrl}/ajuda`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${siteUrl}/termos`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${siteUrl}/privacidade`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
  ]

  const productPages = products.map((product) => ({
    url: `${siteUrl}/checkout/${product.id}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  return [...staticPages, ...productPages]
}
