import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/ProductCard"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import { LogoIcon } from "@/components/Logo"

async function getProducts() {
  const products = await prisma.product.findMany({
    where: { published: true },
    include: { producer: { select: { producerName: true, name: true } } },
    orderBy: { createdAt: "desc" },
  })
  return products
}

async function getUserPurchases(email: string | null | undefined) {
  if (!email) return []
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return []
  const purchases = await prisma.purchase.findMany({
    where: { userId: user.id },
    select: { productId: true },
  })
  return purchases.map((p) => p.productId)
}

export default async function HomePage() {
  const [products, session] = await Promise.all([
    getProducts(),
    getServerSession(authOptions),
  ])

  const purchasedIds = await getUserPurchases(session?.user?.email)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <LogoIcon className="w-16 h-16" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              A{" "}
              <span className="bg-gradient-to-r from-vip-300 to-vip-500 text-transparent bg-clip-text">
                loja de criadores
              </span>{" "}
              mais completa do Brasil
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Crie, venda e entregue cursos, e-books e mentorias com checkout inteligente, área de membros e rede de afiliados — tudo em um só lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-gradient-to-r from-vip-500 to-vip-600 text-white px-8 py-3.5 rounded-xl font-semibold text-lg hover:from-vip-600 hover:to-vip-700 shadow-lg shadow-vip-500/25 transition-all"
              >
                Comece Agora — é grátis
              </Link>
              <Link
                href="#produtos"
                className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all"
              >
                Ver Produtos
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Checkout Inteligente</h3>
              <p className="text-gray-500 text-sm">PIX, boleto e cartão com parcelamento. Taxas competitivas e aprovação instantânea.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Área de Membros</h3>
              <p className="text-gray-500 text-sm">Entrega segura e organizada dos seus conteúdos com acesso vitalício ou por assinatura.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Análise Completa</h3>
              <p className="text-gray-500 text-sm">Dashboard em tempo real com vendas, ganhos e comissões de afiliados.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Taxas Section */}
      <section id="taxas" className="bg-gray-50 py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              🏆 Menores taxas do Brasil
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              As menores taxas do Brasil para criadores de conteúdo
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Quanto mais você fatura, menos paga. Você só paga se vender — sem taxa de adesão, sem mensalidade.
            </p>
          </div>

          {/* Pricing Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {/* Tier 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative">
              <div className="text-sm font-semibold text-gray-500 mb-2">Até 5 dígitos faturados</div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-bold text-gray-900">9,9%</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">+ R$1 por venda aprovada</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Atendimento 7 dias por semana
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Guias práticos e tutoriais
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Área de membros personalizada
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Checkout PIX, cartão e boleto
                </li>
              </ul>
              <Link href="/register" className="block text-center bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors">
                Comece agora
              </Link>
            </div>

            {/* Tier 2 - Destaque */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-8 shadow-lg border border-primary-500 relative text-white scale-105">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-vip-400 text-gray-900 text-xs font-bold px-4 py-1 rounded-full">MAIS POPULAR</span>
              </div>
              <div className="text-sm font-semibold text-primary-200 mb-2">A partir de R$ 500 mil/ano</div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-bold text-white">8,9%</span>
              </div>
              <p className="text-sm text-primary-200 mb-6">+ R$1 por venda aprovada</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-sm text-primary-100">
                  <svg className="w-5 h-5 text-vip-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Tudo do plano anterior
                </li>
                <li className="flex items-start gap-2 text-sm text-primary-100">
                  <svg className="w-5 h-5 text-vip-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Gerente de conta dedicado
                </li>
                <li className="flex items-start gap-2 text-sm text-primary-100">
                  <svg className="w-5 h-5 text-vip-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Relatórios avançados de vendas
                </li>
                <li className="flex items-start gap-2 text-sm text-primary-100">
                  <svg className="w-5 h-5 text-vip-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Suporte prioritário
                </li>
              </ul>
              <Link href="/register" className="block text-center bg-white text-primary-700 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors">
                Comece agora
              </Link>
            </div>

            {/* Tier 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative">
              <div className="text-sm font-semibold text-gray-500 mb-2">6 dígitos faturados</div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-gray-900">até 8,9%</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">+ R$1 por venda aprovada</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Tudo do plano anterior
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Taxas personalizadas
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  API de integração
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Conta corporativa
                </li>
              </ul>
              <Link href="/register" className="block text-center bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors">
                Comece agora
              </Link>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">E quanto custa?</h3>
            <p className="text-center text-gray-500 mb-8">Você só paga se vender. Sem taxa de adesão. Sem mensalidade.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">PIX</h4>
                <p className="text-sm text-gray-500">Receba em 2 dias</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Cartão de Crédito</h4>
                <p className="text-sm text-gray-500">Até 12x | Receba em 15 dias</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Boleto</h4>
                <p className="text-sm text-gray-500">Receba em 2 dias</p>
              </div>
            </div>
            <p className="text-center text-sm text-gray-400 mt-6">* Taxa cobrada sobre o valor total de cada venda aprovada do criador.</p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="produtos" className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Produtos em Destaque</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Confira os melhores infoprodutos disponíveis na plataforma</p>
        </div>
        {products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">Nenhum produto disponível no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                description={product.description}
                price={product.price}
                comparePrice={product.comparePrice}
                imageUrl={product.imageUrl}
                purchased={purchasedIds.includes(product.id)}
                producerName={(product as any).producer?.producerName || (product as any).producer?.name}
              />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-800 to-primary-900 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Seu negócio digital começa aqui</h2>
          <p className="text-primary-200 mb-8 text-lg">Junte-se aos criadores que já escolheram a plataforma mais completa para vender infoprodutos no Brasil.</p>
          <Link
            href="/register"
            className="inline-block bg-gradient-to-r from-vip-400 to-vip-500 text-gray-900 px-8 py-3.5 rounded-xl font-semibold text-lg hover:from-vip-500 hover:to-vip-600 shadow-lg shadow-vip-500/20 transition-all"
          >
            Criar Conta Grátis
          </Link>
        </div>
      </section>
    </div>
  )
}
