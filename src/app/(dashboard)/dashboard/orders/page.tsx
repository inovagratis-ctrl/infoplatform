import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== "admin") redirect("/login")

  const orders = await prisma.order.findMany({
    include: { product: true, user: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Pedidos</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Cliente</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Produto</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Valor</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Status</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Pagamento</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{order.user?.name || order.user?.email}</td>
                <td className="px-6 py-4 text-sm font-medium">{order.product.title}</td>
                <td className="px-6 py-4 text-sm">R$ {order.amount.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    order.status === "completed" ? "bg-green-100 text-green-700" :
                    order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {order.status === "completed" ? "Aprovado" : order.status === "pending" ? "Pendente" : "Cancelado"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{order.paymentMethod || "-"}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  Nenhum pedido ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
