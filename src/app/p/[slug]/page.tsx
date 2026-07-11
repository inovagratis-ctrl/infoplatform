import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import ProductSalesPage from "./ProductSalesPage"

export default async function SalesPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug, published: true },
    include: { producer: { select: { producerName: true, name: true } } },
  })

  if (!product) notFound()

  const highlights = product.highlights ? product.highlights.split("\n").filter(Boolean) : []
  const installmentValue = product.price / product.installments

  return <ProductSalesPage product={product} highlights={highlights} installmentValue={installmentValue} />
}
