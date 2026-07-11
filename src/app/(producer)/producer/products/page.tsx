import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function ProducerProductsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")
  const user = session.user as any
  if (user.role !== "producer" && user.role !== "admin") redirect("/")

  const where = user.role === "producer" ? { producerId: user.id } : {}
  const products = await prisma.product.findMany({ where, orderBy: { createdAt: "desc" } })

  const productTypes: Record<string, string> = {
    course: "Curso",
    ebook: "E-book",
    coaching: "Mentoria",
    community: "Comunidade",
    service: "Serviço",
    file: "Arquivo Digital",
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Produtos</h1>
          <p className="text-gray-500 mt-1">{products.length} produto{products.length !== 1 ? "s" : ""} cadastrado{products.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/producer/products/new"
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-700 shadow-sm transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Produto
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum produto ainda</h3>
          <p className="text-gray-500 mb-6">Crie seu primeiro produto e comece a vender!</p>
          <Link
            href="/producer/products/new"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Criar Primeiro Produto
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-50 relative">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-4xl">📹</span>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    product.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {product.published ? "Publicado" : "Rascunho"}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                    {productTypes[product.productType] || product.productType}
                  </span>
                  {product.category && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {product.category}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.title}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-gray-900">R$ {product.price.toFixed(2)}</span>
                    {product.comparePrice && (
                      <span className="text-sm text-gray-400 line-through ml-2">R$ {product.comparePrice.toFixed(2)}</span>
                    )}
                  </div>
                  <Link
                    href={`/producer/products/${product.id}/edit`}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
