"use client"

import { useState } from "react"

interface Product {
  id: string
  title: string
  slug: string | null
  price: number
  affiliateMaterials: string | null
}

interface Affiliate {
  id: string
  referralCode: string
  commissionRate: number
  user: { name: string | null; email: string }
}

export function ProducerAffiliatesClient({
  products,
  affiliates,
  siteUrl,
}: {
  products: Product[]
  affiliates: Affiliate[]
  siteUrl: string
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [materials, setMaterials] = useState<Record<string, string>>({})

  async function copy(text: string, id: string) {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  function getSalesUrl(p: Product) {
    return p.slug ? `${siteUrl}/p/${p.slug}` : null
  }

  function getCheckoutUrl(p: Product) {
    return `${siteUrl}/checkout/${p.id}`
  }

  function getAffiliateUrl(p: Product, code: string) {
    return `${siteUrl}/checkout/${p.id}?ref=${code}`
  }

  async function saveMaterials(productId: string) {
    await fetch(`/api/producer/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ affiliateMaterials: materials[productId] || "" }),
    })
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Materiais para Afiliados</h1>
        <p className="text-gray-500 mt-1">Compartilhe links e materiais de divulgação com seus afiliados</p>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum produto ainda</h3>
          <p className="text-gray-500">Crie um produto primeiro para gerar links de afiliado.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {products.map((product) => {
            const salesUrl = getSalesUrl(product)
            const checkoutUrl = getCheckoutUrl(product)

            return (
              <div key={product.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{product.title}</h3>
                      <p className="text-sm text-gray-500">R$ {product.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => setSelectedProduct(selectedProduct === product.id ? null : product.id)}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {selectedProduct === product.id ? "Fechar" : "Editar Materiais"}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {/* Sales Page Link */}
                    {salesUrl && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-20 flex-shrink-0">Página de Vendas</span>
                        <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-600 truncate">
                          {salesUrl}
                        </div>
                        <button
                          onClick={() => copy(salesUrl, `sales-${product.id}`)}
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors"
                        >
                          {copiedId === `sales-${product.id}` ? "Copiado!" : "Copiar"}
                        </button>
                      </div>
                    )}

                    {/* Checkout Link */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-20 flex-shrink-0">Checkout</span>
                      <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-600 truncate">
                        {checkoutUrl}
                      </div>
                      <button
                        onClick={() => copy(checkoutUrl, `checkout-${product.id}`)}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors"
                      >
                        {copiedId === `checkout-${product.id}` ? "Copiado!" : "Copiar"}
                      </button>
                    </div>

                    {/* Affiliate Links */}
                    {affiliates.length > 0 && (
                      <details className="group">
                        <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 font-medium [&::-webkit-details-marker]:hidden">
                          🔗 Links de afiliado ({affiliates.length} afiliados)
                        </summary>
                        <div className="mt-2 space-y-2">
                          {affiliates.map((aff) => {
                            const affUrl = getAffiliateUrl(product, aff.referralCode)
                            return (
                              <div key={aff.id} className="flex items-center gap-2 pl-4">
                                <span className="text-xs text-gray-400 w-16 flex-shrink-0 font-mono">{aff.referralCode}</span>
                                <div className="flex-1 bg-primary-50 rounded-lg px-3 py-2 text-sm text-gray-600 truncate">
                                  {affUrl}
                                </div>
                                <button
                                  onClick={() => copy(affUrl, `aff-${product.id}-${aff.id}`)}
                                  className="px-3 py-2 bg-primary-100 hover:bg-primary-200 rounded-lg text-xs font-medium text-primary-700 transition-colors"
                                >
                                  {copiedId === `aff-${product.id}-${aff.id}` ? "Copiado!" : "Copiar"}
                                </button>
                              </div>
                            )
                          })}
                        </div>
                      </details>
                    )}
                  </div>
                </div>

                {/* Materials Editor */}
                {selectedProduct === product.id && (
                  <div className="p-6 bg-gray-50">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📝 Materiais de Divulgação para Afiliados
                    </label>
                    <textarea
                      value={materials[product.id] ?? product.affiliateMaterials ?? ""}
                      onChange={(e) => setMaterials({ ...materials, [product.id]: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500"
                      rows={6}
                      placeholder="Escreva textos prontos, dicas de divulgação, links de banners, vídeos de apresentação que os afiliados podem usar..."
                    />
                    <button
                      onClick={() => saveMaterials(product.id)}
                      className="mt-3 px-5 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                    >
                      Salvar Materiais
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
