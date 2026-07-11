import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function ProductsPage() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== "admin") redirect("/login")

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
        <Link
          href="/dashboard/products/new"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
        >
          + Novo Produto
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Produto</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Preço</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Status</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Criado em</th>
              <th className="text-right px-6 py-3 text-sm font-medium text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{product.title}</p>
                </td>
                <td className="px-6 py-4 text-sm">
                  R$ {product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${product.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {product.published ? "Publicado" : "Rascunho"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(product.createdAt).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/dashboard/products/${product.id}/edit`}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  Nenhum produto cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
