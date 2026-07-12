"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")
  const [msgType, setMsgType] = useState<"success" | "error">("success")
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    role: "",
    producerName: "",
    producerBio: "",
    pixKey: "",
    pixKeyType: "",
    createdAt: "",
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswordSection, setShowPasswordSection] = useState(false)

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { router.push("/login"); return }
        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          cpf: data.cpf ? data.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : "",
          role: data.role || "",
          producerName: data.producerName || "",
          producerBio: data.producerBio || "",
          pixKey: data.pixKey || "",
          pixKeyType: data.pixKeyType || "",
          createdAt: new Date(data.createdAt).toLocaleDateString("pt-BR"),
        })
        setLoading(false)
      })
  }, [router])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setMsg("")

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        cpf: form.cpf,
        phone: form.phone,
        producerName: form.producerName,
        producerBio: form.producerBio,
        pixKey: form.pixKey,
        pixKeyType: form.pixKeyType,
      }),
    })

    if (res.ok) {
      setMsg("Perfil atualizado com sucesso!")
      setMsgType("success")
      await update()
    } else {
      const data = await res.json()
      setMsg(data.error || "Erro ao salvar")
      setMsgType("error")
    }
    setSaving(false)
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMsg("As senhas não coincidem")
      setMsgType("error")
      return
    }
    if (passwordForm.newPassword.length < 6) {
      setMsg("A nova senha deve ter no mínimo 6 caracteres")
      setMsgType("error")
      return
    }

    setSaving(true); setMsg("")
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }),
    })

    if (res.ok) {
      setMsg("Senha alterada com sucesso!")
      setMsgType("success")
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setShowPasswordSection(false)
    } else {
      const data = await res.json()
      setMsg(data.error || "Erro ao alterar senha")
      setMsgType("error")
    }
    setSaving(false)
  }

  const roleLabels: Record<string, string> = {
    user: "Comprador",
    producer: "Produtor",
    affiliate: "Afiliado",
    admin: "Administrador",
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center text-gray-500">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600 mt-1">Conta desde {form.createdAt}</p>
        </div>
        <Link href="/member" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          ← Voltar
        </Link>
      </div>

      {msg && (
        <div className={`px-4 py-3 rounded-lg mb-4 text-sm ${msgType === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {msg}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-700 font-bold text-lg">{form.name?.charAt(0) || form.email.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="font-semibold text-gray-900">{form.name || "Sem nome"}</p>
            <p className="text-sm text-gray-500">{roleLabels[form.role] || form.role}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="(00) 00000-0000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
            <input
              type="text"
              value={form.cpf}
              onChange={(e) => setForm({ ...form, cpf: e.target.value })}
              placeholder="000.000.000-00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {form.role === "producer" && (
            <>
              <hr className="my-4" />
              <h3 className="font-semibold text-gray-900">Dados do Produtor</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Marca / Loja</label>
                <input
                  type="text"
                  value={form.producerName}
                  onChange={(e) => setForm({ ...form, producerName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio / Descrição</label>
                <textarea
                  value={form.producerBio}
                  onChange={(e) => setForm({ ...form, producerBio: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chave Pix</label>
                <input
                  type="text"
                  value={form.pixKey}
                  onChange={(e) => setForm({ ...form, pixKey: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo da Chave Pix</label>
                <select
                  value={form.pixKeyType}
                  onChange={(e) => setForm({ ...form, pixKeyType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Selecione</option>
                  <option value="cpf">CPF</option>
                  <option value="cnpj">CNPJ</option>
                  <option value="email">Email</option>
                  <option value="phone">Telefone</option>
                  <option value="random">Chave Aleatória</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Segurança</h3>
          <button
            onClick={() => setShowPasswordSection(!showPasswordSection)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            {showPasswordSection ? "Cancelar" : "Alterar Senha"}
          </button>
        </div>

        {showPasswordSection && (
          <form onSubmit={handlePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha Atual</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-gray-800 text-white py-2 rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50"
            >
              {saving ? "Alterando..." : "Alterar Senha"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
