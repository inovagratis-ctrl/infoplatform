"use client"

import { useState, useEffect } from "react"

interface ProductLink {
  productId: string
  productTitle: string
  price: number
  slug: string | null
  imageUrl: string | null
  description: string | null
  highlights: string | null
  productType: string
  category: string | null
  producerName: string | null
  affiliateMaterials: string | null
  salesUrl: string | null
  checkoutUrl: string
  affiliateUrl: string
  referralCode: string
}

interface ApiData {
  referralCode: string
  links: ProductLink[]
}

const productTypeIcons: Record<string, string> = {
  course: "🎓",
  ebook: "📚",
  coaching: "🎯",
  community: "👥",
  service: "⚡",
  file: "📎",
}

export default function AffiliateLinksPage() {
  const [data, setData] = useState<ApiData | null>(null)
  const [copied, setCopied] = useState<string | null>("")
  const [expanded, setExpanded] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch("/api/affiliate/link").then(r => r.json()).then(setData)
  }, [])

  function copy(text: string | null) {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(""), 2000)
  }

  if (!data) return <div className="p-8 text-gray-500 text-center">Carregando...</div>

  const filtered = data.links.filter(p =>
    p.productTitle.toLowerCase().includes(search.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Produtos para Promover</h1>
        <p className="text-gray-500 mt-1">
          Seu código: <strong className="text-primary-600 font-mono">{data.referralCode}</strong> — adicione <code className="bg-gray-100 px-1 rounded">?ref={data.referralCode}</code> ao final do link
        </p>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
          placeholder="Buscar produtos..."
        />
      </div>

      <div className="grid gap-4">
        {filtered.map((product) => {
          const icon = productTypeIcons[product.productType] || "📦"
          const highlights = product.highlights ? product.highlights.split("\n").filter(Boolean) : []

          return (
            <div key={product.productId} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Image */}
                  <div className="w-24 h-16 sm:w-32 sm:h-20 rounded-lg bg-gradient-to-br from-primary-100 to-primary-50 flex-shrink-0 overflow-hidden">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">{icon}</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                        {icon} {product.productType}
                      </span>
                      {product.category && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{product.category}</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900">{product.productTitle}</h3>
                    <p className="text-sm text-gray-500">R$ {product.price.toFixed(2)}</p>
                    {product.producerName && (
                      <p className="text-xs text-gray-400 mt-0.5">por {product.producerName}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 space-y-2">
                    <button
                      onClick={() => copy(product.affiliateUrl)}
                      className="block w-full text-center px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      {copied === product.affiliateUrl ? "✓ Copiado!" : "Copiar Link"}
                    </button>
                    {product.salesUrl && (
                      <button
                        onClick={() => copy(product.salesUrl!)}
                        className="block w-full text-center px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        {copied === product.salesUrl ? "✓ Copiado!" : "Página Vendas"}
                      </button>
                    )}
                    <button
                      onClick={() => copy(product.checkoutUrl)}
                      className="block w-full text-center px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      {copied === product.checkoutUrl ? "✓ Copiado!" : "Checkout"}
                    </button>
                  </div>
                </div>

                {/* Description / Materials */}
                {(product.description || product.affiliateMaterials) && (
                  <div className="mt-4">
                    <button
                      onClick={() => setExpanded(expanded === product.productId ? null : product.productId)}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {expanded === product.productId ? "▲ Fechar materiais" : "▼ Ver materiais de divulgação"}
                    </button>

                    {expanded === product.productId && (
                      <div className="mt-3 space-y-3">
                        {product.description && (
                          <p className="text-sm text-gray-600">{product.description}</p>
                        )}

                        {highlights.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {highlights.map((h, i) => (
                              <span key={i} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-lg">✓ {h}</span>
                            ))}
                          </div>
                        )}

                        {product.affiliateMaterials && (
                          <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-xs font-medium text-gray-500 mb-2">📝 Materiais do Produtor</p>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{product.affiliateMaterials}</p>
                          </div>
                        )}

                        <div className="text-xs text-gray-400 bg-gray-50 rounded-lg px-4 py-3">
                          <p className="font-medium mb-1">🔗 Seus links para este produto:</p>
                          <div className="space-y-1">
                            <p>Afiliado: <code className="bg-gray-200 px-1 rounded text-primary-600">{product.affiliateUrl}</code></p>
                            {product.salesUrl && <p>Vendas: <code className="bg-gray-200 px-1 rounded">{product.salesUrl}</code></p>}
                            <p>Checkout: <code className="bg-gray-200 px-1 rounded">{product.checkoutUrl}</code></p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Nenhum produto encontrado.
          </div>
        )}
      </div>
    </div>
  )
}
