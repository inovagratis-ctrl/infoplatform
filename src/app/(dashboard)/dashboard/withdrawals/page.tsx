"use client"

import { useState, useEffect } from "react"

interface Withdrawal {
  id: string
  userId: string
  amount: number
  type: string
  pixKey: string
  pixKeyType: string
  status: string
  createdAt: string
  user: { name: string | null; email: string }
}

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  const fetchWithdrawals = async () => {
    const res = await fetch("/api/admin/withdrawals")
    const data = await res.json()
    setWithdrawals(data)
    setLoading(false)
  }

  useEffect(() => { fetchWithdrawals() }, [])

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    setProcessing(id)
    await fetch(`/api/admin/withdrawals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    setProcessing(null)
    fetchWithdrawals()
  }

  if (loading) return <div className="text-gray-500 py-8">Carregando...</div>

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Saques Pendentes</h1>
        <p className="text-gray-500 mt-1">Gerencie as solicitações de saque de produtores e afiliados</p>
      </div>

      {withdrawals.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum saque pendente</h3>
          <p className="text-gray-500">Todos os saques foram processados</p>
        </div>
      ) : (
        <div className="space-y-4">
          {withdrawals.map((w) => (
            <div key={w.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-900">R$ {w.amount.toFixed(2)}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      w.type === "producer" ? "bg-blue-100 text-blue-700" : "bg-vip-100 text-vip-700"
                    }`}>
                      {w.type === "producer" ? "Produtor" : "Afiliado"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    <strong>{w.user.name || w.user.email}</strong> — {w.user.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    PIX: {w.pixKey} ({w.pixKeyType.toUpperCase()})
                  </p>
                  <p className="text-xs text-gray-400">
                    Solicitado em {new Date(w.createdAt).toLocaleDateString("pt-BR")} às {new Date(w.createdAt).toLocaleTimeString("pt-BR")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(w.id, "approved")}
                    disabled={processing === w.id}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    Aprovar
                  </button>
                  <button
                    onClick={() => handleAction(w.id, "rejected")}
                    disabled={processing === w.id}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    Recusar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
