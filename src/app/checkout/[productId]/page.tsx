"use client"

import { useState, useEffect, Suspense } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"

const PAYMENT_METHODS = [
  { name: "Cartão de Crédito", icon: "💳", desc: "Até 12x sem juros | Receba em 15 dias" },
  { name: "PIX", icon: "⚡", desc: "Aprovação instantânea | Receba em até 2 dias úteis" },
]

const BENEFITS = [
  "Acesso vitalício ao conteúdo",
  "Suporte prioritário por email",
  "Certificado de conclusão",
  "Atualizações gratuitas",
]

function CheckoutContent() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const ref = searchParams.get("ref")
  const canceled = searchParams.get("canceled")
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`/api/products/${params.productId}`)
      .then((r) => r.json())
      .then(setProduct)
  }, [params.productId])

  async function handlePurchase() {
    if (!session) {
      router.push("/login")
      return
    }

    setLoading(true)
    setError("")

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: params.productId, ref }),
    })

    const data = await res.json()

    if (res.ok && data.url) {
      window.location.href = data.url
    } else {
      setError(data.error || "Erro ao processar compra")
      setLoading(false)
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Carregando...</p>
        </div>
      </div>
    )
  }

  const installments = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => ({
    n,
    value: product.price / n,
  }))
  const bestInstallment = installments.find((i) => i.value >= 30) || installments[installments.length - 1]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">

          {/* LEFT - Product Info */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.title} className="w-full h-64 lg:h-80 object-cover" />
              ) : (
                <div className="w-full h-64 lg:h-80 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                  <span className="text-8xl font-bold text-white/90">{product.title[0]}</span>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">{product.title}</h1>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3">Você receberá:</h3>
                <ul className="space-y-3">
                  {BENEFITS.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {product.contentType && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-3">Detalhes do Produto</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3">
                      <span className="text-lg">{product.contentType === "video" ? "🎬" : product.contentType === "pdf" ? "📚" : "🔗"}</span>
                      <span className="text-gray-600">Formato: <strong>{product.contentType === "video" ? "Vídeo" : product.contentType === "pdf" ? "PDF/E-book" : "Online"}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3">
                      <span className="text-lg">♾️</span>
                      <span className="text-gray-600">Acesso: <strong>Vitalício</strong></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT - Checkout Summary */}
          <div className="lg:col-span-2 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Pedido</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{product.title}</span>
                  <span className="text-gray-900 font-medium">
                    R$ {product.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Desconto</span>
                  <span className="text-green-600 font-medium">
                    {product.comparePrice && product.comparePrice > product.price
                      ? `-R$ ${(product.comparePrice - product.price).toFixed(2)}`
                      : "—"}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-gray-900 font-semibold">Total</span>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">
                      R$ {product.price.toFixed(2)}
                    </div>
                    {bestInstallment.n > 1 && (
                      <div className="text-sm text-gray-500">
                        ou <strong>{bestInstallment.n}x de R$ {bestInstallment.value.toFixed(2)}</strong> sem juros
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Formas de pagamento</h3>
                <div className="grid grid-cols-3 gap-2">
                  {PAYMENT_METHODS.map((pm) => (
                    <div key={pm.name} className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                      <div className="text-xl mb-1">{pm.icon}</div>
                      <div className="text-xs font-medium text-gray-700">{pm.name.split(" ")[0]}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{pm.desc}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex justify-center gap-2">
                  <span className="text-xs text-gray-400">Visa</span>
                  <span className="text-xs text-gray-400">Mastercard</span>
                  <span className="text-xs text-gray-400">Elo</span>
                  <span className="text-xs text-gray-400">Hipercard</span>
                  <span className="text-xs text-gray-400">Amex</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm border border-red-100">
                  {error}
                </div>
              )}

              {canceled && (
                <div className="bg-yellow-50 text-yellow-700 px-4 py-3 rounded-lg mb-4 text-sm border border-yellow-100">
                  Pagamento não concluído. Tente novamente.
                </div>
              )}

              <button
                onClick={handlePurchase}
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3.5 rounded-xl font-semibold text-lg hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-200 transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processando...
                  </span>
                ) : (
                  "Comprar Agora"
                )}
              </button>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Pagamento 100% seguro via Stripe
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Dados protegidos com criptografia SSL
                </div>
              </div>

              {!session && (
                <div className="mt-4 p-4 bg-primary-50 rounded-xl border border-primary-100">
                  <p className="text-sm text-primary-700 text-center">
                    Já tem conta?{" "}
                    <button onClick={() => router.push("/login")} className="font-semibold underline">
                      Faça login
                    </button>{" "}
                    para comprar mais rápido
                  </p>
                </div>
              )}
            </div>

            {/* Trust badges */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { icon: "🛡️", text: "Compra Garantida" },
                { icon: "🚚", text: "Acesso Imediato" },
                { icon: "💬", text: "Suporte 24h" },
              ].map((badge) => (
                <div key={badge.text} className="bg-white rounded-xl border border-gray-100 p-3 text-center shadow-sm">
                  <div className="text-xl mb-1">{badge.icon}</div>
                  <div className="text-xs text-gray-600 font-medium">{badge.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Carregando...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
