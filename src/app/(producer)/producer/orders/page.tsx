import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function ProducerOrdersPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")
  const user = session.user as any
  if (user.role !== "producer" && user.role !== "admin") redirect("/")

  const prodId = user.role === "producer" ? user.id : undefined
  const where = prodId ? { product: { producerId: prodId } } : {}

  const [orders, totals] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        product: { select: { title: true, price: true } },
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.order.aggregate({
      where,
      _sum: { amount: true },
      _count: true,
    }),
  ])

  const completed = orders.filter(o => o.status === "completed")
  const pending = orders.filter(o => o.status === "pending")

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Vendas</h1>
        <p className="text-gray-500 mt-1">Acompanhe todos os pedidos dos seus produtos</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Total de Pedidos</p>
          <p className="text-3xl font-bold text-gray-900">{totals._count}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Concluídas</p>
          <p className="text-3xl font-bold text-green-600">{completed.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Faturamento Bruto</p>
          <p className="text-3xl font-bold text-gray-900">R$ {(totals._sum.amount || 0).toFixed(2)}</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="text-5xl mb-4">🛒</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma venda ainda</h3>
          <p className="text-gray-500">Compartilhe seus produtos para começar a vender</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Produto</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Cliente</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Valor</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Pagamento</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.product.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.user.name || order.user.email}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">R$ {order.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.paymentMethod === "card" ? "💳 Cartão" :
                       order.paymentMethod === "pix" ? "📱 PIX" :
                       order.paymentMethod === "boleto" ? "📄 Boleto" : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        order.status === "completed" ? "bg-green-100 text-green-700" :
                        order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {order.status === "completed" ? "Concluída" :
                         order.status === "pending" ? "Pendente" : order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString("pt-BR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
