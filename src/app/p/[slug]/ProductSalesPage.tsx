"use client"

import Link from "next/link"
import { LogoIcon } from "@/components/Logo"

interface Product {
  id: string
  title: string
  description: string
  price: number
  comparePrice: number | null
  imageUrl: string | null
  installments: number
  productType: string
  targetAudience: string | null
  requirements: string | null
  producer: { producerName: string | null; name: string | null } | null
}

export default function ProductSalesPage({
  product,
  highlights,
  installmentValue,
}: {
  product: Product
  highlights: string[]
  installmentValue: number
}) {
  const productTypes: Record<string, string> = {
    course: "Curso Online",
    ebook: "E-book",
    coaching: "Mentoria",
    community: "Comunidade",
    service: "Serviço",
    file: "Arquivo Digital",
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <LogoIcon className="w-8 h-8" />
            <span className="font-bold text-gray-900">Núcleo <span className="text-amber-500">VIP</span></span>
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Product Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full font-medium">
                {productTypes[product.productType] || product.productType}
              </span>
              {product.producer?.producerName && (
                <span className="text-xs text-gray-500">por {product.producer.producerName}</span>
              )}
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {product.title}
            </h1>

            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

            {product.targetAudience && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">📌 Para quem é este produto</h3>
                <p className="text-gray-600 text-sm">{product.targetAudience}</p>
              </div>
            )}

            {product.requirements && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">📋 Pré-requisitos</h3>
                <p className="text-gray-600 text-sm">{product.requirements}</p>
              </div>
            )}

            {highlights.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">✅ O que você vai ter</h3>
                <ul className="space-y-3">
                  {highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="text-green-500 mt-0.5">✓</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Producer info */}
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-xl">
                🎓
              </div>
              <div>
                <p className="font-medium text-gray-900">{product.producer?.producerName || product.producer?.name || "Produtor"}</p>
                <p className="text-sm text-gray-500">Produtor na Núcleo VIP</p>
              </div>
            </div>
          </div>

          {/* Right: Pricing + CTA */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              {product.imageUrl && (
                <div className="rounded-xl overflow-hidden mb-6">
                  <img src={product.imageUrl} alt={product.title} className="w-full aspect-video object-cover" />
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-gray-900">
                    R$ {product.price.toFixed(2)}
                  </span>
                  {product.comparePrice && product.comparePrice > product.price && (
                    <span className="text-lg text-gray-400 line-through">
                      R$ {product.comparePrice.toFixed(2)}
                    </span>
                  )}
                </div>
                {product.installments > 1 && (
                  <p className="text-sm text-gray-500 mt-1">
                    ou <strong>{product.installments}x de R$ {installmentValue.toFixed(2)}</strong> no cartão
                  </p>
                )}
              </div>

              <Link
                href={`/checkout/${product.id}`}
                className="block w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white text-center py-4 rounded-xl font-semibold text-lg hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-200 transition-all mb-4"
              >
                Comprar Agora
              </Link>

              <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                <span>🔒 Pagamento seguro</span>
                <span>📱 PIX</span>
                <span>💳 Cartão até {product.installments}x</span>
                <span>📄 Boleto</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
