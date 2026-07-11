import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
  const purchases = await prisma.purchase.findMany({ include: { product: true, user: true } })
  console.log("Compras atuais:")
  purchases.forEach(p => console.log("-", p.user?.email, "->", p.product?.title))

  const seen = new Set<string>()
  for (const p of purchases) {
    const key = p.userId + p.productId
    if (seen.has(key)) {
      await prisma.purchase.delete({ where: { id: p.id } })
      console.log("Duplicata removida:", p.id)
    } else {
      seen.add(key)
    }
  }

  const remaining = await prisma.purchase.count()
  console.log("Total após limpeza:", remaining)
}

main().finally(() => prisma.$disconnect())
