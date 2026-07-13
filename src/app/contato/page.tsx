"use client"

import { useState } from "react"
import { LogoIcon } from "@/components/Logo"
import Link from "next/link"

const roles = [
  { value: "", label: "Selecione seu perfil" },
  { value: "producer", label: "Produtor", icon: "🎓" },
  { value: "buyer", label: "Comprador / Aluno", icon: "👤" },
  { value: "affiliate", label: "Afiliado", icon: "🚀" },
  { value: "other", label: "Outro", icon: "💬" },
]

const subjects: Record<string, { value: string; label: string }[]> = {
  producer: [
    { value: "criar-produto", label: "Criação de produto" },
    { value: "vendas", label: "Dúvidas sobre vendas" },
    { value: "pagamento", label: "Pagamento e repasses" },
    { value: "suporte-tecnico", label: "Suporte técnico" },
    { value: "outro", label: "Outro assunto" },
  ],
  buyer: [
    { value: "acesso", label: "Problemas de acesso" },
    { value: "reembolso", label: "Solicitar reembolso" },
    { value: "pagamento", label: "Dúvidas sobre pagamento" },
    { value: "suporte-tecnico", label: "Suporte técnico" },
    { value: "outro", label: "Outro assunto" },
  ],
  affiliate: [
    { value: "link", label: "Link de afiliado" },
    { value: "comissao", label: "Dúvidas sobre comissão" },
    { value: "pagamento", label: "Pagamento de comissões" },
    { value: "suporte-tecnico", label: "Suporte técnico" },
    { value: "outro", label: "Outro assunto" },
  ],
  other: [
    { value: "parceria", label: "Proposta de parceria" },
    { value: "imprensa", label: "Imprensa" },
    { value: "reclamacao", label: "Reclamação" },
    { value: "outro", label: "Outro assunto" },
  ],
}

export default function ContatoPage() {
  const [form, setForm] = useState({ name: "", email: "", role: "", subject: "", message: "" })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  function update(key: string, value: string) {
    const next = { ...form, [key]: value }
    if (key === "role") next.subject = ""
    setForm(next)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "46acd572-d430-455d-b3f6-6aa63e8d2036",
          name: form.name,
          email: form.email,
          subject: `[Núcleo VIP] ${form.role} - ${form.subject}`,
          message: `Perfil: ${form.role}\nAssunto: ${form.subject}\n\n${form.message}`,
          from_name: "Núcleo VIP",
          replyto: form.email,
        }),
      })

      const result = await res.json()

      if (result.success) {
        setSent(true)
      } else {
        throw new Error("Erro ao enviar")
      }
    } catch (err: any) {
      setError(err.message || "Erro ao enviar mensagem")
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mensagem enviada!</h1>
          <p className="text-gray-500 mb-6">
            Recebemos sua solicitação e responderemos em breve no e-mail <strong>{form.email}</strong>.
          </p>
          <button
            onClick={() => { setSent(false); setForm({ name: "", email: "", role: "", subject: "", message: "" }) }}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Enviar outra mensagem
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 text-primary-200 hover:text-white">
            ← Voltar ao site
          </Link>
          <div className="flex justify-center mb-4">
            <LogoIcon className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Fale Conosco</h1>
          <p className="text-xl text-primary-200">Estamos prontos para ajudar você</p>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-2xl mx-auto px-4 -mt-8 relative z-10 pb-16">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Seu nome"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Você é</label>
                <div className="grid grid-cols-2 gap-2">
                  {roles.filter((r) => r.value).map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => update("role", r.value)}
                      className={`p-3 rounded-xl border-2 text-center text-sm transition-all ${
                        form.role === r.value
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-lg block">{r.icon}</span>
                      <span className="font-medium text-gray-700 text-xs">{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assunto</label>
                <select
                  value={form.subject}
                  onChange={(e) => update("subject", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                  disabled={!form.role}
                >
                  <option value="">{form.role ? "Selecione" : "Selecione seu perfil primeiro"}</option>
                  {(subjects[form.role] || []).map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
              <textarea
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={5}
                placeholder="Descreva sua dúvida ou solicitação em detalhes..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-xl font-medium hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 shadow-lg shadow-primary-200 transition-all"
            >
              {loading ? "Enviando..." : "Enviar Mensagem"}
            </button>

            <p className="text-xs text-gray-400 text-center">
              Responderemos no e-mail informado em até 48 horas úteis.
            </p>
          </form>
        </div>
      </section>
    </div>
  )
}
