import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/ProductCard"

export default async function MemberPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })
  if (!user) redirect("/login")

  const purchases = await prisma.purchase.findMany({
    where: { userId: user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  })

  const allProducts = await prisma.product.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  })

  const purchasedIds = new Set(purchases.map((p) => p.productId))

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Meus Produtos</h1>
      <p className="text-gray-600 mb-8">
        {purchases.length > 0
          ? `Você possui ${purchases.length} produto(s) adquirido(s).`
          : "Você ainda não adquiriu nenhum produto."}
      </p>

      {purchases.length > 0 && (
        <>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Produtos Adquiridos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {purchases.map((purchase) => (
              <ProductCard
                key={purchase.id}
                id={purchase.product.id}
                title={purchase.product.title}
                description={purchase.product.description}
                price={purchase.product.price}
                comparePrice={purchase.product.comparePrice}
                imageUrl={purchase.product.imageUrl}
                purchased
              />
            ))}
          </div>
        </>
      )}

      <h2 className="text-xl font-semibold text-gray-900 mb-4">Produtos em Destaque</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {allProducts
          .filter((p) => !purchasedIds.has(p.id))
          .slice(0, 6)
          .map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              description={product.description}
              price={product.price}
              comparePrice={product.comparePrice}
              imageUrl={product.imageUrl}
            />
          ))}
      </div>
    </div>
  )
}
