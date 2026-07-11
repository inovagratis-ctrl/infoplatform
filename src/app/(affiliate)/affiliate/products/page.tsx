"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

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

export default function AffiliateProductsPage() {
  const [data, setData] = useState<ApiData | null>(null)
  const [copied, setCopied] = useState<string | null>("")

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

  const showMaterials = data.links.filter(p => p.affiliateMaterials)
  const noMaterials = data.links.filter(p => !p.affiliateMaterials)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Materiais de Divulgação</h1>
        <p className="text-gray-500 mt-1">Links prontos e materiais fornecidos pelos produtores</p>
      </div>

      {/* Products with Materials */}
      {showMaterials.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">📝 Com Materiais Exclusivos</h2>
          <div className="grid gap-4">
            {showMaterials.map((product) => {
              const highlights = product.highlights ? product.highlights.split("\n").filter(Boolean) : []
              return (
                <div key={product.productId} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                          {productTypeIcons[product.productType] || "📦"} {product.productType}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900">{product.productTitle}</h3>
                      <p className="text-sm text-gray-500">R$ {product.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => copy(product.affiliateUrl)}
                      className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                    >
                      {copied === product.affiliateUrl ? "✓ Copiado!" : "Copiar Link Afiliado"}
                    </button>
                  </div>

                  {/* Producer's Materials */}
                  <div className="bg-vip-50 border border-vip-100 rounded-xl p-4 mb-3">
                    <p className="text-xs font-medium text-vip-700 mb-2">📝 Materiais do Produtor</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{product.affiliateMaterials}</p>
                  </div>

                  {highlights.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {highlights.map((h, i) => (
                        <span key={i} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-lg">✓ {h}</span>
                      ))}
                    </div>
                  )}

                  {product.description && (
                    <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                  )}

                  <div className="flex gap-2">
                    <button onClick={() => copy(product.affiliateUrl)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${copied === product.affiliateUrl ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                      🔗 Link Afiliado
                    </button>
                    <button onClick={() => copy(product.checkoutUrl)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${copied === product.checkoutUrl ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                      🛒 Checkout
                    </button>
                    {product.salesUrl && (
                      <button onClick={() => copy(product.salesUrl)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${copied === product.salesUrl ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                        📄 Página Vendas
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Products without Materials */}
      {noMaterials.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">📦 Outros Produtos</h2>
          <div className="grid gap-3">
            {noMaterials.map((product) => (
              <div key={product.productId} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{product.productTitle}</p>
                  <p className="text-sm text-gray-500">R$ {product.price.toFixed(2)}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => copy(product.affiliateUrl)}
                    className="px-3 py-1.5 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-700">
                    {copied === product.affiliateUrl ? "✓" : "Copiar Link"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
