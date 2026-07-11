"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

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

export default function NewProducerProductPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    title: "", description: "", price: "", comparePrice: "",
    imageUrl: "", contentUrl: "", contentType: "video",
    productType: "course", category: "", tags: "",
    highlights: "", targetAudience: "", requirements: "", affiliateMaterials: "",
    slug: "", installments: "1",
    isSubscription: false, subscriptionDays: "", published: false,
  })
  const [loading, setLoading] = useState(false)
  const [previewImg, setPreviewImg] = useState(false)

  function update(key: string, value: any) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch("/api/producer/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) { router.push("/producer/products"); router.refresh() }
    else { alert("Erro ao criar produto"); setLoading(false) }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Novo Produto</h1>
        <p className="text-gray-500 mt-1">Preencha as informações do seu produto</p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => setStep(s)}
              className={`w-8 h-8 rounded-full text-sm font-medium flex items-center justify-center transition-all ${
                step === s ? "bg-primary-600 text-white" :
                step > s ? "bg-green-100 text-green-700" :
                "bg-gray-100 text-gray-400"
              }`}
            >
              {step > s ? "✓" : s}
            </button>
            <span className={`text-sm font-medium ${step === s ? "text-gray-900" : "text-gray-400"}`}>
              {s === 1 ? "Informações" : s === 2 ? "Conteúdo" : "Publicação"}
            </span>
            {s < 3 && <div className="w-12 h-0.5 bg-gray-200" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo do Produto</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {productTypes.map((pt) => (
                  <button
                    key={pt.value}
                    type="button"
                    onClick={() => update("productType", pt.value)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      form.productType === pt.value
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <span className="text-2xl block mb-1">{pt.icon}</span>
                    <span className="text-xs font-medium text-gray-700">{pt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título do Produto</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => {
                      update("title", e.target.value)
                      if (!form.slug) update("slug", e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""))
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ex: Curso Completo de Marketing Digital"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Amigável (slug)</label>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>nucleovip.com.br/p/</span>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) => update("slug", e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      placeholder="meu-curso"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select
                    value={form.category}
                    onChange={(e) => update("category", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags (separadas por vírgula)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => update("tags", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="marketing, vendas, digital"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={5}
                    placeholder="Descreva seu produto em detalhes..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Para quem é este produto?</label>
                  <textarea
                    value={form.targetAudience}
                    onChange={(e) => update("targetAudience", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                    placeholder="Ex: Iniciantes em marketing digital que querem criar sua primeira estratégia..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pré-requisitos</label>
                  <textarea
                    value={form.requirements}
                    onChange={(e) => update("requirements", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={2}
                    placeholder="Ex: Conhecimento básico de internet, vontade de aprender..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Pricing & Content */}
        {step === 2 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <h3 className="font-semibold text-gray-900">Precificação</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                    <input
                      type="number" step="0.01" min="0"
                      value={form.price}
                      onChange={(e) => update("price", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                      placeholder="97,00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço Original (R$)</label>
                    <input
                      type="number" step="0.01" min="0"
                      value={form.comparePrice}
                      onChange={(e) => update("comparePrice", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                      placeholder="197,00"
                    />
                    <p className="text-xs text-gray-400 mt-1">Mostra o valor riscado (de/por)</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parcelamento</label>
                  <select
                    value={form.installments}
                    onChange={(e) => update("installments", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                  >
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => (
                      <option key={n} value={n}>{n}x de R$ {(parseFloat(form.price || "0") / n).toFixed(2)} {n === 1 ? "(à vista)" : ""}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="subscription"
                    checked={form.isSubscription}
                    onChange={(e) => update("isSubscription", e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="subscription" className="text-sm text-gray-700">Produto com assinatura/recorrência</label>
                </div>
                {form.isSubscription && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ciclo (dias)</label>
                    <input
                      type="number" min="1"
                      value={form.subscriptionDays}
                      onChange={(e) => update("subscriptionDays", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                      placeholder="30"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <h3 className="font-semibold text-gray-900">Mídia</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem de Capa</label>
                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={(e) => { update("imageUrl", e.target.value); setPreviewImg(true) }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                    placeholder="https://exemplo.com/capa.jpg"
                  />
                  {previewImg && form.imageUrl && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 w-48">
                      <img src={form.imageUrl} alt="Preview" className="w-full aspect-video object-cover"
                        onError={() => setPreviewImg(false)} />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo / Área de Membros</label>
                  <div className="flex gap-2 mb-2">
                    {["video", "article", "file", "link"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => update("contentType", type)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                          form.contentType === type
                            ? "border-primary-500 bg-primary-50 text-primary-700"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {type === "video" ? "🎬 Vídeo" : type === "article" ? "📝 Artigo" : type === "file" ? "📎 Arquivo" : "🔗 Link"}
                      </button>
                    ))}
                  </div>
                  <input
                    type="url"
                    value={form.contentUrl}
                    onChange={(e) => update("contentUrl", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                    placeholder="URL do conteúdo (YouTube, Vimeo, Drive, etc)"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Destaques do Produto (um por linha)</label>
              <textarea
                value={form.highlights}
                onChange={(e) => update("highlights", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                rows={4}
                placeholder="Acesso vitalício&#10;Certificado de conclusão&#10;Suporte 1:1 com o instrutor&#10;Bônus exclusivos"
              />
              <p className="text-xs text-gray-400 mt-1">Cada linha vira um bullet point na página de vendas</p>
            </div>
          </div>
        )}

        {/* Step 3: Publish */}
        {step === 3 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 space-y-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Quase lá!</h3>
              <p className="text-gray-500">Revise as informações e publique seu produto</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Produto</span>
                <span className="text-sm font-semibold text-gray-900">{form.title || "—"}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Tipo</span>
                <span className="text-sm font-semibold text-gray-900">{productTypes.find(t => t.value === form.productType)?.label}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Preço</span>
                <span className="text-sm font-semibold text-gray-900">R$ {parseFloat(form.price || "0").toFixed(2)} em até {form.installments}x</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Slug</span>
                <span className="text-sm font-semibold text-gray-900">/p/{form.slug || "—"}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Comissão da Plataforma</span>
                <span className="text-sm font-semibold text-green-600">5%</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <label className="flex items-center gap-3 bg-gray-50 rounded-xl px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => update("published", e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-5 h-5"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Publicar imediatamente</p>
                  <p className="text-xs text-gray-500">Produto ficará visível na vitrine</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <div>
            {step > 1 && (
              <button type="button" onClick={() => setStep(step - 1)}
                className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                Voltar
              </button>
            )}
          </div>
          <div className="flex gap-3">
            {step < 3 ? (
              <button type="button" onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors">
                Continuar
              </button>
            ) : (
              <button type="submit" disabled={loading}
                className="px-8 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-medium hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 shadow-lg shadow-primary-200 transition-all">
                {loading ? "Publicando..." : (form.published ? "Publicar Produto" : "Salvar como Rascunho")}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
