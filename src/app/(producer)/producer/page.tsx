import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function ProducerDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")
  const user = session.user as any
  if (user.role !== "producer" && user.role !== "admin") redirect("/")

  const prodId = user.role === "producer" ? user.id : undefined
  const where = prodId ? { producerId: prodId } : {}
  const earningsWhere = prodId ? { producerId: prodId } : {}

  const [totalProducts, totalOrders, earningsAgg, recentOrders] = await Promise.all([
    prisma.product.count({ where }),
    prisma.order.count({ where: { product: where } }),
    prisma.producerEarning.aggregate({
      where: earningsWhere,
      _sum: { amount: true },
    }),
    prisma.order.findMany({
      where: { product: where },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { product: { select: { title: true } } },
    }),
  ])

  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  const monthEarnings = await prisma.producerEarning.aggregate({
    where: { ...earningsWhere, createdAt: { gte: monthStart } },
    _sum: { amount: true },
  })

  const pendingEarnings = await prisma.producerEarning.aggregate({
    where: { ...earningsWhere, status: "pending" },
    _sum: { amount: true },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Bem-vindo de volta, {user.name || user.email}!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
              <span className="text-xl">📦</span>
            </div>
          </div>
          <p className="text-sm text-gray-500">Produtos</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
            <Link href="/producer/products/new" className="text-xs text-primary-600 hover:text-primary-700 font-medium">
              + Novo
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <span className="text-xl">💰</span>
            </div>
          </div>
          <p className="text-sm text-gray-500">Vendas</p>
          <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-vip-50 rounded-lg flex items-center justify-center">
              <span className="text-xl">📈</span>
            </div>
          </div>
          <p className="text-sm text-gray-500">Faturamento Total</p>
          <p className="text-3xl font-bold text-vip-600">R$ {(earningsAgg._sum.amount || 0).toFixed(2)}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <span className="text-xl">📅</span>
            </div>
          </div>
          <p className="text-sm text-gray-500">Este Mês</p>
          <p className="text-3xl font-bold text-blue-600">R$ {(monthEarnings._sum.amount || 0).toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Acesso Rápido</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/producer/products/new" className="bg-primary-600 text-white p-4 rounded-xl hover:bg-primary-700 transition-colors">
              <p className="text-2xl mb-1">+</p>
              <p className="text-sm font-medium">Criar Produto</p>
            </Link>
            <Link href="/producer/products" className="bg-gray-800 text-white p-4 rounded-xl hover:bg-gray-700 transition-colors">
              <p className="text-2xl mb-1">📋</p>
              <p className="text-sm font-medium">Ver Produtos</p>
            </Link>
            <Link href="/producer/orders" className="bg-gradient-to-br from-primary-700 to-primary-800 text-white p-4 rounded-xl hover:from-primary-800 hover:to-primary-900 transition-colors">
              <p className="text-2xl mb-1">🛒</p>
              <p className="text-sm font-medium">Vendas</p>
            </Link>
            <Link href="/producer/earnings" className="bg-gradient-to-br from-vip-600 to-vip-700 text-white p-4 rounded-xl hover:from-vip-700 hover:to-vip-800 transition-colors">
              <p className="text-2xl mb-1">💎</p>
              <p className="text-sm font-medium">Ganhos</p>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Resumo Financeiro</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-600">Faturamento Total</span>
              <span className="text-sm font-semibold text-gray-900">R$ {(earningsAgg._sum.amount || 0).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-600">Faturamento Este Mês</span>
              <span className="text-sm font-semibold text-blue-600">R$ {(monthEarnings._sum.amount || 0).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-600">A Receber (pendente)</span>
              <span className="text-sm font-semibold text-vip-600">R$ {(pendingEarnings._sum.amount || 0).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Comissão da Plataforma</span>
              <span className="text-sm font-semibold text-gray-500">5%</span>
            </div>
          </div>
        </div>
      </div>

      {recentOrders.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Últimas Vendas</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Produto</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Valor</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">{order.product.title}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">R$ {order.amount.toFixed(2)}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === "completed" ? "bg-green-100 text-green-700" :
                        order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {order.status === "completed" ? "Concluída" : order.status === "pending" ? "Pendente" : order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString("pt-BR")}</td>
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
