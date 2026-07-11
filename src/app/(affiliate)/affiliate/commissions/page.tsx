"use client"

import { useState, useEffect } from "react"
import { WithdrawalSection } from "@/components/WithdrawalSection"

export default function AffiliateCommissionsPage() {
  const [data, setData] = useState<any>(null)
  const [withdrawals, setWithdrawals] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/affiliate/commissions").then(r => r.json()).then(setData)
    fetch("/api/withdrawals").then(r => r.json()).then((w) => {
      setWithdrawals(w.withdrawals || [])
    })
  }, [])

  if (!data) return <div className="max-w-7xl mx-auto px-4 py-8 text-gray-500">Carregando...</div>

  const pendingTotal = data.sales
    .filter((s: any) => s.status === "pending")
    .reduce((acc: number, s: any) => acc + s.commission, 0)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Minhas Comissões</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Total em Comissões</p>
          <p className="text-2xl font-bold text-gray-900">R$ {data.totalCommissions.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Vendas Geradas</p>
          <p className="text-2xl font-bold text-gray-900">{data.totalSales}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Taxa de Comissão</p>
          <p className="text-2xl font-bold text-green-600">{data.commissionRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Produto</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Comissão</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.sales.map((sale: any) => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">{sale.order?.product?.title}</td>
                    <td className="px-6 py-4 text-sm">R$ {sale.commission.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        sale.status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {sale.status === "paid" ? "Pago" : "Pendente"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(sale.createdAt).toLocaleDateString("pt-BR")}</td>
                  </tr>
                ))}
                {data.sales.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">Nenhuma comissão ainda.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <WithdrawalSection type="affiliate" balance={pendingTotal} withdrawals={withdrawals} />
        </div>
      </div>
    </div>
  )
}
