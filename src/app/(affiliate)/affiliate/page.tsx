import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function AffiliateDashboard() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { affiliate: true },
  })
  if (!user?.affiliate) redirect("/")

  const totals = await prisma.affiliateSale.aggregate({
    where: { affiliateId: user.affiliate.id },
    _sum: { commission: true },
    _count: true,
  })

  const productsCount = await prisma.product.count({ where: { published: true } })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Painel do Afiliado</h1>
        <p className="text-gray-600 mt-1">Seu código de afiliado: <strong className="text-primary-600">{user.affiliate.referralCode}</strong></p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Comissões</p>
          <p className="text-3xl font-bold text-gray-900">R$ {(totals._sum.commission || 0).toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Vendas</p>
          <p className="text-3xl font-bold text-gray-900">{totals._count}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Produtos para Promover</p>
          <p className="text-3xl font-bold text-gray-900">{productsCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Link href="/affiliate/links" className="bg-primary-600 text-white p-8 rounded-xl hover:bg-primary-700">
          <h3 className="text-xl font-semibold mb-2">Links de Afiliado</h3>
          <p className="text-primary-100">Gerencie seus links de divulgação</p>
        </Link>
        <Link href="/affiliate/commissions" className="bg-gray-800 text-white p-8 rounded-xl hover:bg-gray-700">
          <h3 className="text-xl font-semibold mb-2">Comissões</h3>
          <p className="text-gray-300">Veja suas comissões e vendas</p>
        </Link>
      </div>
    </div>
  )
}
