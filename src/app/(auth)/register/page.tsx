"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: "", email: "", cpf: "", password: "", role: "user", producerName: "", producerBio: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError("")

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, cpf: form.cpf.replace(/\D/g, "") }),
    })

    if (!res.ok) { const d = await res.json(); setError(d.error || "Erro"); setLoading(false); return }

    const result = await signIn("credentials", { email: form.email, password: form.password, redirect: false })
    if (result?.ok) { router.push("/"); router.refresh() }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Criar Conta</h1>

          {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
              <input
                type="text"
                value={form.cpf}
                onChange={(e) => setForm({...form, cpf: e.target.value.replace(/\D/g, "").replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4") })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="000.000.000-00"
                maxLength={14}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Conta</label>
              <select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})} className="w-full px-4 py-2 border rounded-lg">
                <option value="user">Comprador</option>
                <option value="producer">Produtor (quero vender)</option>
                <option value="affiliate">Afiliado (quero promover)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg" required />
            </div>

            {form.role === "producer" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Marca / Loja</label>
                  <input type="text" value={form.producerName} onChange={(e) => setForm({...form, producerName: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio / Descrição</label>
                  <textarea value={form.producerBio} onChange={(e) => setForm({...form, producerBio: e.target.value})} className="w-full px-4 py-2 border rounded-lg" rows={2} />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full px-4 py-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} className="w-full px-4 py-2 border rounded-lg" required minLength={6} />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50">
              {loading ? "Cadastrando..." : "Criar Conta"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Já tem conta? <Link href="/login" className="text-primary-600 font-medium">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
