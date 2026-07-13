"use client"

import { useState, useEffect, Suspense } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"

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
  const [pixData, setPixData] = useState<any>(null)
  const [copying, setCopying] = useState(false)

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

    if (res.ok && data.qr_code) {
      setPixData(data)
    } else {
      setError(data.error || "Erro ao processar pagamento")
      setLoading(false)
    }
  }

  async function copyPixCode() {
    if (!pixData?.qr_code) return
    setCopying(true)
    try {
      await navigator.clipboard.writeText(pixData.qr_code)
      setTimeout(() => setCopying(false), 2000)
    } catch {
      setCopying(false)
    }
  }

  if (pixData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">⚡</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">PIX Gerado!</h1>
          <p className="text-gray-500 mb-6">
            Escaneie o QR Code ou copie o código abaixo para pagar
          </p>

          {pixData.qr_code_base64 && (
            <div className="mb-6">
              <img
                src={`data:image/png;base64,${pixData.qr_code_base64}`}
                alt="QR Code PIX"
                className="mx-auto border rounded-lg"
                style={{ maxWidth: 250 }}
              />
            </div>
          )}

          <div className="mb-6">
            <p className="text-xs text-gray-400 mb-2">Código PIX (copie e cole):</p>
            <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 break-all font-mono">
              {pixData.qr_code}
            </div>
          </div>

          <button
            onClick={copyPixCode}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all mb-4"
          >
            {copying ? "✅ Copiado!" : "📋 Copiar Código PIX"}
          </button>

          <p className="text-xs text-gray-400">
            O PIX expira em 30 minutos. Após o pagamento, o acesso será liberado automaticamente.
          </p>

          <button
            onClick={() => { setPixData(null); setLoading(false) }}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700"
          >
            ← Voltar ao checkout
          </button>
        </div>
      </div>
    )
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
                  {["Acesso vitalício ao conteúdo", "Suporte prioritário por email", "Certificado de conclusão", "Atualizações gratuitas"].map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Pedido</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{product.title}</span>
                  <span className="text-gray-900 font-medium">R$ {product.price.toFixed(2)}</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-gray-900 font-semibold">Total</span>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">R$ {product.price.toFixed(2)}</div>
                    {bestInstallment.n > 1 && (
                      <div className="text-sm text-gray-500">
                        ou <strong>{bestInstallment.n}x de R$ {bestInstallment.value.toFixed(2)}</strong> sem juros
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Formas de pagamento</h3>
                <div className="space-y-2">
                  <div className="bg-green-50 rounded-lg p-3 flex items-center gap-3 border border-green-200">
                    <span className="text-xl">⚡</span>
                    <div>
                      <div className="text-sm font-medium text-green-800">PIX</div>
                      <div className="text-xs text-green-600">Aprovação instantânea</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3 border border-gray-200">
                    <span className="text-xl">💳</span>
                    <div>
                      <div className="text-sm font-medium text-gray-700">Cartão de Crédito</div>
                      <div className="text-xs text-gray-500">Até 12x sem juros</div>
                    </div>
                  </div>
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
                  Pagamento 100% seguro via Mercado Pago
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
