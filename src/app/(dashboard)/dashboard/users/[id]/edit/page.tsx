"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"

const roleLabels: Record<string, string> = {
  admin: "Admin",
  producer: "Produtor",
  affiliate: "Afiliado",
  user: "Comprador",
}

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams()
  const [form, setForm] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: "",
    role: "user",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/users/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({
          name: data.name || "",
          email: data.email || "",
          cpf: data.cpf || "",
          phone: data.phone || "",
          role: data.role || "user",
        })
      })
  }, [params.id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const res = await fetch(`/api/admin/users/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      alert("Usuario atualizado com sucesso!")
      router.push("/dashboard/users")
      router.refresh()
    } else {
      const data = await res.json()
      alert(data.error || "Erro ao atualizar usuario")
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este usuario? Esta acao nao pode ser desfeita.")) return
    setLoading(true)

    const res = await fetch(`/api/admin/users/${params.id}`, {
      method: "DELETE",
    })

    if (res.ok) {
      alert("Usuario excluido com sucesso!")
      router.push("/dashboard/users")
      router.refresh()
    } else {
      const data = await res.json()
      alert(data.error || "Erro ao excluir usuario")
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Editar Usuario</h1>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
        >
          Excluir Usuario
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
            <input
              type="text"
              value={form.cpf}
              onChange={(e) => setForm({ ...form, cpf: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="000.000.000-00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="(00) 00000-0000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Papel</label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            {Object.entries(roleLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Salvar Alteracoes"}
          </button>
        </div>
      </form>
    </div>
  )
}
