import { prisma } from "@/lib/prisma"
import Link from "next/link"

async function getStats() {
  const [
    totalProducts, totalOrders, totalRevenue, totalUsers,
    producersCount, affiliatesCount, pendingMessages,
    monthOrders, monthRevenue,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { amount: true }, where: { status: "completed" } }),
    prisma.user.count(),
    prisma.user.count({ where: { role: "producer" } }),
    prisma.affiliate.count(),
    prisma.contactMessage.count(),
    prisma.order.count({ where: { createdAt: { gte: new Date(new Date().setDate(1)) } } }),
    prisma.order.aggregate({ _sum: { amount: true }, where: { status: "completed", createdAt: { gte: new Date(new Date().setDate(1)) } } }),
  ])

  return { totalProducts, totalOrders, totalRevenue: totalRevenue._sum.amount || 0, totalUsers, producersCount, affiliatesCount, pendingMessages, monthOrders, monthRevenue: monthRevenue._sum.amount || 0 }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const cards = [
    { label: "Usuários", value: stats.totalUsers, sub: `${stats.producersCount} produtores · ${stats.affiliatesCount} afiliados`, href: "/dashboard/users", color: "text-blue-600" },
    { label: "Produtos", value: stats.totalProducts, sub: "total cadastrados", href: "/dashboard/products", color: "text-gray-900" },
    { label: "Pedidos", value: stats.totalOrders, sub: `${stats.monthOrders} este mês`, href: "/dashboard/orders", color: "text-gray-900" },
    { label: "Receita Total", value: `R$ ${stats.totalRevenue.toFixed(2)}`, sub: `R$ ${stats.monthRevenue.toFixed(2)} este mês`, href: "/dashboard/orders", color: "text-green-600" },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Visão geral da plataforma</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}
            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm text-gray-500 mb-1">{card.label}</p>
            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Acesso Rápido</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/dashboard/products/new" className="bg-primary-600 text-white p-4 rounded-xl hover:bg-primary-700">
              <p className="text-2xl mb-1">+</p>
              <p className="text-sm font-medium">Criar Produto</p>
            </Link>
            <Link href="/dashboard/users" className="bg-gray-800 text-white p-4 rounded-xl hover:bg-gray-700">
              <p className="text-2xl mb-1">👥</p>
              <p className="text-sm font-medium">Usuários</p>
            </Link>
            <Link href="/dashboard/messages" className="bg-gradient-to-br from-primary-700 to-primary-800 text-white p-4 rounded-xl hover:from-primary-800 hover:to-primary-900 relative">
              <p className="text-2xl mb-1">✉️</p>
              <p className="text-sm font-medium">Mensagens</p>
              {stats.pendingMessages > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {stats.pendingMessages}
                </span>
              )}
            </Link>
            <Link href="/dashboard/earnings" className="bg-gradient-to-br from-vip-600 to-vip-700 text-white p-4 rounded-xl hover:from-vip-700 hover:to-vip-800">
              <p className="text-2xl mb-1">📈</p>
              <p className="text-sm font-medium">Ganhos</p>
            </Link>
            <Link href="/dashboard/withdrawals" className="bg-gradient-to-br from-green-600 to-green-700 text-white p-4 rounded-xl hover:from-green-700 hover:to-green-800">
              <p className="text-2xl mb-1">💰</p>
              <p className="text-sm font-medium">Saques</p>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Plataforma</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-600">Taxa da plataforma</span>
              <span className="text-sm font-semibold text-green-600">5%</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-600">Stripe</span>
              <span className="text-sm font-semibold text-gray-500">Modo Teste</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-600">Produtores</span>
              <span className="text-sm font-semibold">{stats.producersCount}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Afiliados</span>
              <span className="text-sm font-semibold">{stats.affiliatesCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
