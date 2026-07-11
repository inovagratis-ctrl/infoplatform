import { prisma } from "@/lib/prisma"

export default async function AdminAffiliatesPage() {
  const affiliates = await prisma.affiliate.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { sales: true } },
    },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Afiliados</h1>
        <p className="text-gray-500 mt-1">{affiliates.length} afiliado{affiliates.length !== 1 ? "s" : ""} cadastrado{affiliates.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Nome</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Código</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Comissão</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Vendas</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Desde</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {affiliates.map((aff) => (
                <tr key={aff.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{aff.user.name || "—"}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{aff.user.email}</td>
                  <td className="px-6 py-4 text-sm font-mono text-primary-600 font-medium">{aff.referralCode}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{aff.commissionRate}%</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{aff._count.sales}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(aff.createdAt).toLocaleDateString("pt-BR")}</td>
                </tr>
              ))}
              {affiliates.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">Nenhum afiliado cadastrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
