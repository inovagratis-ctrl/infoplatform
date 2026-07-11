import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProducerAffiliatesClient } from "./ProducerAffiliatesClient"

export default async function ProducerAffiliatesPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")
  const user = session.user as any
  if (user.role !== "producer" && user.role !== "admin") redirect("/")

  const where = user.role === "producer" ? { producerId: user.id } : {}
  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
  })

  const affiliates = await prisma.affiliate.findMany({
    include: { user: { select: { name: true, email: true } } },
  })

  return <ProducerAffiliatesClient products={products} affiliates={affiliates} siteUrl={process.env.NEXT_PUBLIC_SITE_URL || "https://nucleovip.com.br"} />
}
