"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewProductPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    comparePrice: "",
    imageUrl: "",
    contentUrl: "",
    contentType: "video",
    isSubscription: false,
    subscriptionDays: "",
    published: false,
  })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      router.push("/dashboard/products")
      router.refresh()
    } else {
      alert("Erro ao criar produto")
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Novo Produto</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
            <input
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preço Comparativo (R$)</label>
            <input
              type="number"
              step="0.01"
              value={form.comparePrice}
              onChange={(e) => setForm({ ...form, comparePrice: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
          <input
            type="url"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL do Conteúdo (vídeo/material)</label>
          <input
            type="url"
            value={form.contentUrl}
            onChange={(e) => setForm({ ...form, contentUrl: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Conteúdo</label>
            <select
              value={form.contentType}
              onChange={(e) => setForm({ ...form, contentType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="video">Vídeo</option>
              <option value="pdf">PDF/E-book</option>
              <option value="text">Texto</option>
              <option value="link">Link Externo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dias de Acesso (assinatura)</label>
            <input
              type="number"
              value={form.subscriptionDays}
              onChange={(e) => setForm({ ...form, subscriptionDays: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              disabled={!form.isSubscription}
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isSubscription}
              onChange={(e) => setForm({ ...form, isSubscription: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Assinatura</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Publicar</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? "Criando..." : "Criar Produto"}
        </button>
      </form>
    </div>
  )
}
