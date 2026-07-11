"use client"

import { useState } from "react"
import { WithdrawalForm } from "./WithdrawalForm"

interface Withdrawal {
  id: string
  amount: number
  fee: number
  grossAmount: number
  type: string
  pixKey: string
  pixKeyType: string
  status: string
  createdAt: string | Date
  processedAt: string | Date | null
}

interface Props {
  type: "producer" | "affiliate"
  balance: number
  withdrawals: Withdrawal[]
}

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  approved: "Aprovado",
  rejected: "Recusado",
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
}

export function WithdrawalSection({ type, balance, withdrawals }: Props) {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="space-y-6">
      <WithdrawalForm
        key={refreshKey}
        type={type}
        balance={balance}
        onSuccess={() => setRefreshKey(k => k + 1)}
      />

      {withdrawals.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Saques</h3>
          <div className="space-y-3">
            {withdrawals.map((w) => (
              <div key={w.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    R$ {w.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(w.createdAt).toLocaleDateString("pt-BR")}
                    {" — "}
                    PIX {w.pixKeyType.toUpperCase()}
                    {w.fee ? ` — Taxa: R$ ${w.fee.toFixed(2)}` : ""}
                  </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[w.status] || "bg-gray-100 text-gray-600"}`}>
                  {statusLabels[w.status] || w.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
