"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"

const productTypes = [
  { value: "course", label: "Curso Online", icon: "🎓" },
  { value: "ebook", label: "E-book", icon: "📚" },
  { value: "coaching", label: "Mentoria", icon: "🎯" },
  { value: "community", label: "Comunidade", icon: "👥" },
  { value: "service", label: "Serviço", icon: "⚡" },
  { value: "file", label: "Arquivo Digital", icon: "📎" },
]

const categories = [
  "Negócios", "Marketing", "Finanças", "Desenvolvimento Pessoal",
  "Saúde", "Fitness", "Música", "Design", "Programação", "Idiomas",
  "Gastronomia", "Fotografia", "Vendas", "Empreendedorismo", "Outro",
]

export default function EditProducerProductPage() {
  const router = useRouter()
  const params = useParams()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    title: "", description: "", price: "", comparePrice: "",
    imageUrl: "", contentUrl: "", contentType: "video",
    productType: "course", category: "", tags: "",
    highlights: "", targetAudience: "", requirements: "",
    slug: "", installments: "1",
    isSubscription: false, subscriptionDays: "", published: false,
  })
  const [loading, setLoading] = useState(false)
  const [previewImg, setPreviewImg] = useState(false)

  useEffect(() => {
    fetch(`/api/products/${params.id}`).then(r => r.json()).then(data => {
      setForm({
        title: data.title, description: data.description, price: String(data.price),
        comparePrice: data.comparePrice ? String(data.comparePrice) : "", imageUrl: data.imageUrl || "",
        contentUrl: data.contentUrl || "", contentType: data.contentType,
        productType: data.productType || "course", category: data.category || "", tags: data.tags || "",
        highlights: data.highlights || "", targetAudience: data.targetAudience || "",
        requirements: data.requirements || "", slug: data.slug || "", installments: String(data.installments || 1),
        isSubscription: data.isSubscription, subscriptionDays: data.subscriptionDays ? String(data.subscriptionDays) : "",
        published: data.published,
      })
    })
  }, [params.id])

  function update(key: string, value: any) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch(`/api/producer/products/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) { router.push("/producer/products"); router.refresh() }
    else { alert("Erro ao atualizar"); setLoading(false) }
  }

  async function handleDelete() {
    if (!confirm("Excluir produto?")) return
    await fetch(`/api/producer/products/${params.id}`, { method: "DELETE" })
    router.push("/producer/products"); router.refresh()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar Produto</h1>
          <p className="text-gray-500 mt-1">{form.title || "Carregando..."}</p>
        </div>
        <button onClick={handleDelete} className="text-red-600 hover:text-red-700 text-sm font-medium px-4 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition-colors">
          Excluir Produto
        </button>
      </div>

      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => setStep(s)}
              className={`w-8 h-8 rounded-full text-sm font-medium flex items-center justify-center transition-all ${
                step === s ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-400"
              }`}
            >{s}</button>
            <span className={`text-sm font-medium ${step === s ? "text-gray-900" : "text-gray-400"}`}>
              {s === 1 ? "Informações" : s === 2 ? "Conteúdo" : "Publicação"}
            </span>
            {s < 3 && <div className="w-12 h-0.5 bg-gray-200" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo do Produto</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {productTypes.map((pt) => (
                  <button key={pt.value} type="button" onClick={() => update("productType", pt.value)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      form.productType === pt.value ? "border-primary-500 bg-primary-50" : "border-gray-200 hover:border-gray-300"
                    }`}>
                    <span className="text-2xl block mb-1">{pt.icon}</span>
                    <span className="text-xs font-medium text-gray-700">{pt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                  <input type="text" value={form.title} onChange={(e) => update("title", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Amigável</label>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>nucleovip.com.br/p/</span>
                    <input type="text" value={form.slug} onChange={(e) => update("slug", e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select value={form.category} onChange={(e) => update("category", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500">
                    <option value="">Selecione</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <input type="text" value={form.tags} onChange={(e) => update("tags", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl" placeholder="marketing, vendas" />
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea value={form.description} onChange={(e) => update("description", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl" rows={5} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Público-alvo</label>
                  <textarea value={form.targetAudience} onChange={(e) => update("targetAudience", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl" rows={3} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pré-requisitos</label>
                  <textarea value={form.requirements} onChange={(e) => update("requirements", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl" rows={2} />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <h3 className="font-semibold text-gray-900">Precificação</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                    <input type="number" step="0.01" value={form.price} onChange={(e) => update("price", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço Original</label>
                    <input type="number" step="0.01" value={form.comparePrice} onChange={(e) => update("comparePrice", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parcelamento</label>
                  <select value={form.installments} onChange={(e) => update("installments", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl">
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => (
                      <option key={n} value={n}>{n}x de R$ {(parseFloat(form.price || "0") / n).toFixed(2)}</option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={form.isSubscription} onChange={(e) => update("isSubscription", e.target.checked)}
                    className="rounded border-gray-300 text-primary-600" />
                  <span className="text-sm text-gray-700">Assinatura/recorrência</span>
                </label>
                {form.isSubscription && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ciclo (dias)</label>
                    <input type="number" value={form.subscriptionDays} onChange={(e) => update("subscriptionDays", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl" />
                  </div>
                )}
              </div>
              <div className="space-y-6">
                <h3 className="font-semibold text-gray-900">Mídia</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
                  <input type="url" value={form.imageUrl} onChange={(e) => { update("imageUrl", e.target.value); setPreviewImg(true) }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl" />
                  {form.imageUrl && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 w-48">
                      <img src={form.imageUrl} alt="Preview" className="w-full aspect-video object-cover" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo</label>
                  <div className="flex gap-2 mb-2">
                    {["video", "article", "file", "link"].map((type) => (
                      <button key={type} type="button" onClick={() => update("contentType", type)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                          form.contentType === type ? "border-primary-500 bg-primary-50 text-primary-700" : "border-gray-200 text-gray-600"
                        }`}>
                        {type === "video" ? "🎬 Vídeo" : type === "article" ? "📝 Artigo" : type === "file" ? "📎 Arquivo" : "🔗 Link"}
                      </button>
                    ))}
                  </div>
                  <input type="url" value={form.contentUrl} onChange={(e) => update("contentUrl", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl" />
                </div>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Destaques (um por linha)</label>
              <textarea value={form.highlights} onChange={(e) => update("highlights", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl" rows={4} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 space-y-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Revisão Final</h3>
              <p className="text-gray-500">Confira os dados e salve as alterações</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Produto</span>
                <span className="text-sm font-semibold text-gray-900">{form.title}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Preço</span>
                <span className="text-sm font-semibold text-gray-900">R$ {parseFloat(form.price || "0").toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`text-sm font-semibold ${form.published ? "text-green-600" : "text-gray-500"}`}>
                  {form.published ? "Publicado" : "Rascunho"}
                </span>
              </div>
            </div>
            <label className="flex items-center justify-center gap-3 bg-gray-50 rounded-xl px-6 py-4 cursor-pointer">
              <input type="checkbox" checked={form.published} onChange={(e) => update("published", e.target.checked)}
                className="rounded border-gray-300 text-primary-600 w-5 h-5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Produto publicado</p>
                <p className="text-xs text-gray-500">Visível na vitrine da plataforma</p>
              </div>
            </label>
          </div>
        )}

        <div className="flex items-center justify-between mt-8">
          <div>
            {step > 1 && (
              <button type="button" onClick={() => setStep(step - 1)}
                className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50">
                Voltar
              </button>
            )}
          </div>
          <div className="flex gap-3">
            {step < 3 ? (
              <button type="button" onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700">
                Continuar
              </button>
            ) : (
              <button type="submit" disabled={loading}
                className="px-8 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-medium hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 shadow-lg shadow-primary-200">
                {loading ? "Salvando..." : "Salvar Alterações"}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
