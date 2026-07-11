"use client"

import { useState, useEffect } from "react"

const FEE = 3.19

interface WithdrawalData {
  withdrawals: any[]
  producerBalance: number
  affiliateBalance: number
  pixKey: string | null
  pixKeyType: string | null
}

interface Props {
  type: "producer" | "affiliate"
  balance: number
  onSuccess: () => void
}

const pixTypes = [
  { value: "cpf", label: "CPF" },
  { value: "cnpj", label: "CNPJ" },
  { value: "email", label: "E-mail" },
  { value: "phone", label: "Telefone" },
  { value: "random", label: "Chave Aleatória" },
]

export function WithdrawalForm({ type, balance, onSuccess }: Props) {
  const [amount, setAmount] = useState("")
  const [pixKey, setPixKey] = useState("")
  const [pixKeyType, setPixKeyType] = useState("cpf")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const numAmount = parseFloat(amount) || 0
  const grossAmount = numAmount + FEE

  useEffect(() => {
    fetch("/api/withdrawals").then(r => r.json()).then((data: WithdrawalData) => {
      if (data.pixKey) setPixKey(data.pixKey)
      if (data.pixKeyType) setPixKeyType(data.pixKeyType)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const res = await fetch("/api/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numAmount,
          type,
          pixKey,
          pixKeyType,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Erro ao solicitar saque")
        return
      }
      setSuccess("Saque solicitado com sucesso! Aguarde o processamento.")
      setAmount("")
      onSuccess()
    } catch {
      setError("Erro ao conectar com o servidor")
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = numAmount > 0 && grossAmount <= balance && !loading

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Solicitar Saque</h3>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valor que deseja receber
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max={balance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="0,00"
              required
            />
          </div>
          {numAmount > 0 && (
            <div className="mt-2 space-y-1 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Taxa de saque</span>
                <span>R$ {FEE.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700 font-medium border-t border-gray-100 pt-1">
                <span>Total debitado do saldo</span>
                <span>R$ {grossAmount.toFixed(2)}</span>
              </div>
            </div>
          )}
          <p className="text-xs text-gray-400 mt-1">Saldo disponível: R$ {balance.toFixed(2)}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Chave PIX
          </label>
          <select
            value={pixKeyType}
            onChange={(e) => setPixKeyType(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            {pixTypes.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chave PIX
          </label>
          <input
            type="text"
            value={pixKey}
            onChange={(e) => setPixKey(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            placeholder="Digite sua chave PIX"
            required
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full bg-gradient-to-r from-vip-500 to-vip-600 text-white py-2.5 rounded-lg font-medium hover:from-vip-600 hover:to-vip-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Solicitando..." : "Solicitar Saque"}
        </button>
      </form>
    </div>
  )
}
