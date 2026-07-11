import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { WithdrawalSection } from "@/components/WithdrawalSection"

export default async function ProducerEarningsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")
  const user = session.user as any
  if (user.role !== "producer" && user.role !== "admin") redirect("/")

  const prodId = user.role === "producer" ? user.id : undefined
  const where = prodId ? { producerId: prodId } : {}

  const [earnings, totals, withdrawals] = await Promise.all([
    prisma.producerEarning.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        order: {
          include: { product: { select: { title: true } } },
        },
      },
    }),
    prisma.producerEarning.aggregate({
      where,
      _sum: { amount: true },
      _count: true,
    }),
    prisma.withdrawal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ])

  const pendingTotal = earnings.filter(e => e.status === "pending").reduce((acc, e) => acc + e.amount, 0)
  const paidTotal = earnings.filter(e => e.status === "paid").reduce((acc, e) => acc + e.amount, 0)

  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)
  const monthEarnings = earnings.filter(e => new Date(e.createdAt) >= monthStart)
  const monthTotal = monthEarnings.reduce((acc, e) => acc + e.amount, 0)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Ganhos</h1>
        <p className="text-gray-500 mt-1">Acompanhe seus rendimentos e solicite saques</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Total Recebido</p>
          <p className="text-3xl font-bold text-gray-900">R$ {(totals._sum.amount || 0).toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Este Mês</p>
          <p className="text-3xl font-bold text-blue-600">R$ {monthTotal.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">A Receber</p>
          <p className="text-3xl font-bold text-vip-600">R$ {pendingTotal.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Já Pago</p>
          <p className="text-3xl font-bold text-green-600">R$ {paidTotal.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          {earnings.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
              <div className="text-5xl mb-4">📈</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum ganho registrado</h3>
              <p className="text-gray-500">Os ganhos aparecerão quando houver vendas</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Produto</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Valor</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Taxa</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Líquido</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {earnings.map((earning) => (
                      <tr key={earning.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {earning.order?.product?.title || "Produto"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          R$ {earning.order?.amount.toFixed(2) || "0,00"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">5%</td>
                        <td className="px-6 py-4 text-sm font-medium text-green-600">
                          R$ {earning.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            earning.status === "paid" ? "bg-green-100 text-green-700" :
                            earning.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                            "bg-gray-100 text-gray-600"
                          }`}>
                            {earning.status === "paid" ? "Pago" : earning.status === "pending" ? "Pendente" : earning.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(earning.createdAt).toLocaleDateString("pt-BR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div>
          <WithdrawalSection type="producer" balance={pendingTotal} withdrawals={withdrawals} />
        </div>
      </div>
    </div>
  )
}
