import { prisma } from "@/lib/prisma"

export default async function AdminEarningsPage() {
  const [earnings, producers] = await Promise.all([
    prisma.producerEarning.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        producer: { select: { name: true, email: true } },
        order: { include: { product: { select: { title: true } } } },
      },
    }),
    prisma.user.findMany({
      where: { role: "producer" },
      include: {
        _count: { select: { earnings: true } },
        earnings: { select: { amount: true, status: true } },
      },
    }),
  ])

  const totalEarnings = earnings.reduce((acc, e) => acc + e.amount, 0)
  const pendingEarnings = earnings.filter(e => e.status === "pending").reduce((acc, e) => acc + e.amount, 0)
  const paidEarnings = earnings.filter(e => e.status === "paid").reduce((acc, e) => acc + e.amount, 0)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Ganhos</h1>
        <p className="text-gray-500 mt-1">Gerenciamento de ganhos dos produtores</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Total em Ganhos</p>
          <p className="text-3xl font-bold text-gray-900">R$ {totalEarnings.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Pendente</p>
          <p className="text-3xl font-bold text-vip-600">R$ {pendingEarnings.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Já Pago</p>
          <p className="text-3xl font-bold text-green-600">R$ {paidEarnings.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Produtores</h2>
          <div className="space-y-3">
            {producers.map((producer) => {
              const total = producer.earnings.reduce((acc, e) => acc + e.amount, 0)
              const pending = producer.earnings.filter(e => e.status === "pending").reduce((acc, e) => acc + e.amount, 0)
              return (
                <div key={producer.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{producer.name || producer.email}</p>
                    <p className="text-xs text-gray-400">{producer._count.earnings} recebimentos</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">R$ {total.toFixed(2)}</p>
                    {pending > 0 && <p className="text-xs text-vip-600">R$ {pending.toFixed(2)} pendente</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {earnings.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Últimos Recebimentos</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Produtor</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Produto</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Valor</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {earnings.map((earning) => (
                  <tr key={earning.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{earning.producer.name || earning.producer.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{earning.order?.product?.title || "—"}</td>
                    <td className="px-6 py-4 text-sm font-medium text-green-600">R$ {earning.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        earning.status === "paid" ? "bg-green-100 text-green-700" :
                        earning.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"
                      }`}>
                        {earning.status === "paid" ? "Pago" : "Pendente"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(earning.createdAt).toLocaleDateString("pt-BR")}</td>
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
