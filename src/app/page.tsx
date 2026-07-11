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
      <section className="relative overflow-hidden bg-gray-900 text-white min-h-[600px] flex items-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80')" }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-primary-900/85 to-gray-900/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-gray-900/50" />
        
        <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <LogoIcon className="w-16 h-16" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
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
                <span className="text-5xl font-bold text-gray-900">4,99%</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">por venda aprovada</p>
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
                <span className="text-5xl font-bold text-white">3,99%</span>
              </div>
              <p className="text-sm text-primary-200 mb-6">por venda aprovada</p>
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
                <span className="text-4xl font-bold text-gray-900">até 2,99%</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">por venda aprovada</p>
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
                <p className="text-sm text-gray-500">Receba em até 2 dias úteis</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Cartão de Crédito</h4>
                <p className="text-sm text-gray-500">Até 12x | Receba em até 15 dias</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Boleto</h4>
                <p className="text-sm text-gray-500">Receba em até 2 dias úteis</p>
              </div>
            </div>
            <p className="text-center text-sm text-gray-400 mt-6">* Taxa cobrada sobre o valor total de cada venda aprovada do criador.</p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-primary-100 text-primary-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              Por que a Núcleo VIP?
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Tudo que você precisa para vender seus infoprodutos
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Ferramentas poderosas para criadores de conteúdo que querem focar no que importa: criar e vender.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <span className="inline-block bg-vip-100 text-vip-700 text-sm font-semibold px-3 py-1 rounded-full mb-4">Área de Membros</span>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Área de Membros Premium</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Ofereça uma experiência cinematográfica para seus alunos. Área de membros personalizável com layout moderno, similar às plataformas de streaming favoritas.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Design personalizado com sua identidade visual
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Acesso vitalício ou por assinatura
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Mobile app para seus alunos assistirem às aulas
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-vip-50 rounded-3xl p-8 flex items-center justify-center">
              <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">C</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Curso Completo</p>
                    <p className="text-xs text-gray-500">12 módulos • 48 aulas</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Módulo 1: Introdução</p>
                      <p className="text-xs text-gray-500">4 aulas • 2h</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Módulo 2: Fundamentos</p>
                      <p className="text-xs text-gray-500">6 aulas • 3h</p>
                    </div>
                  </div>
                  <div className="bg-primary-50 rounded-lg p-3 flex items-center gap-3 border border-primary-200">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Módulo 3: Avançado</p>
                      <p className="text-xs text-primary-600">Em andamento</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 md:order-1 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 flex items-center justify-center">
              <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-semibold text-gray-900">Saques Rápidos</p>
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">Disponível</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-lg">⚡</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">PIX</p>
                        <p className="text-xs text-gray-500">Aprovação instantânea</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-green-600">2 dias</p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-lg">💳</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Cartão</p>
                        <p className="text-xs text-gray-500">Até 12x</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-green-600">15 dias</p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-lg">📄</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Boleto</p>
                        <p className="text-xs text-gray-500">Pague em até 3 dias</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-green-600">2 dias</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full mb-4">Saques Rápidos</span>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Receba seus ganhos com rapidez</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Suas vendas via PIX são liberadas em até 2 dias úteis. Para vendas via cartão, opte por receber em 15 dias. Boleto liberado em até 2 dias úteis.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  PIX: receba em até 2 dias úteis
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Cartão: receba em até 15 dias
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Boleto: receba em até 2 dias úteis
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-purple-100 text-purple-700 text-sm font-semibold px-3 py-1 rounded-full mb-4">Rede de Afiliados</span>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Marketplace de Afiliados</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Amplie suas vendas com uma rede de afiliados promovendo seu produto. Você define a comissão e os afiliados fazem o trabalho pesado de divulgação.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Cadastre seu produto no marketplace
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Defina a comissão para cada afiliado
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Acompanhe as vendas e comissões em tempo real
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 flex items-center justify-center">
              <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-semibold text-gray-900">Seus Afiliados</p>
                  <span className="text-sm text-gray-500">5 ativos</span>
                </div>
                <div className="space-y-3">
                  {[
                    { name: "Maria S.", sales: 23, commission: "10%" },
                    { name: "João P.", sales: 18, commission: "12%" },
                    { name: "Ana L.", sales: 15, commission: "10%" },
                  ].map((affiliate, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-700 font-bold text-sm">{affiliate.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{affiliate.name}</p>
                          <p className="text-xs text-gray-500">{affiliate.commission} comissão</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-green-600">{affiliate.sales} vendas</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-gray-50 py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-primary-100 text-primary-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              Como funciona
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Comece a vender em 4 passos simples
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Simples, rápido e sem burocracia. Comece a vender seus infoprodutos hoje mesmo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Crie sua conta",
                desc: "Cadastre-se gratuitamente em menos de 2 minutos. Sem cartão de crédito, sem compromisso.",
                icon: (
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "Cadastre seu produto",
                desc: "Adicione título, descrição, preço e conteúdo. Configure PIX, cartão e boleto em poucos cliques.",
                icon: (
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Comece a vender",
                desc: "Compartilhe seu link, ative afiliados e comece a receber vendas. O checkout faz tudo para você.",
                icon: (
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ),
              },
              {
                step: "04",
                title: "Receba seus ganhos",
                desc: "PIX em até 2 dias, cartão em 15 dias. Saque a qualquer momento pelo painel do produtor.",
                icon: (
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div key={i} className="text-center relative">
                {i < 3 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary-300 to-primary-100" />
                )}
                <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-6 relative z-10">
                  {item.icon}
                </div>
                <div className="inline-block bg-primary-100 text-primary-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
                  Passo {item.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-20 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-gray-100 text-gray-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              Perguntas Frequentes
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Tire suas dúvidas
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Quanto custa usar a Núcleo VIP?",
                a: "Nada! Você só paga quando vende. A taxa é de apenas 4,99% sobre cada venda aprovada (ou menos conforme seu faturamento). Não há taxa de adesão ou mensalidade.",
              },
              {
                q: "Quais formas de pagamento são aceitas?",
                a: "Aceitamos PIX (aprovação instantânea), cartão de crédito em até 12x sem juros e boleto bancário. Todas processadas com segurança via Stripe.",
              },
              {
                q: "Como recebo meus ganhos?",
                a: "Vendas via PIX são liberadas em até 2 dias úteis. Cartão de crédito em até 15 dias. Boleto em até 2 dias úteis. Você pode solicitar saque a qualquer momento pelo painel.",
              },
              {
                q: "Posso vender qualquer tipo de infoproduto?",
                a: "Sim! Cursos, e-books, mentorias, workshops, templates e qualquer produto digital. A plataforma suporta acesso vitalício ou por assinatura.",
              },
              {
                q: "Como funciona o sistema de afiliados?",
                a: "Você cadastra seu produto no marketplace e define a comissão para os afiliados. Eles compartilham seu link e ganham comissão sobre cada venda realizada.",
              },
              {
                q: "Preciso saber programar para usar?",
                a: "Não! A plataforma é intuitiva e fácil de usar. Você cria sua conta e começa a vender em 2 minutos, sem necessidade de conhecimento técnico.",
              },
            ].map((item, i) => (
              <details key={i} className="group bg-gray-50 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                  {item.q}
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
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
      <section className="bg-gradient-to-r from-gray-900 via-primary-900 to-gray-900 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            Você só paga se vender
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Quanto custa? <span className="text-vip-400">Nada.</span>
          </h2>
          <p className="text-primary-200 mb-4 text-lg">
            Cadastre-se grátis, cadastre seus produtos e comece a vender. Sem taxa de adesão, sem mensalidade, sem surpresas.
          </p>
          <p className="text-primary-300 mb-10 text-sm">
            Apenas 4,99% sobre cada venda aprovada (ou menos conforme seu faturamento).
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-block bg-gradient-to-r from-vip-400 to-vip-500 text-gray-900 px-10 py-4 rounded-xl font-bold text-lg hover:from-vip-500 hover:to-vip-600 shadow-lg shadow-vip-500/20 transition-all"
            >
              Criar Conta Grátis
            </Link>
            <Link
              href="/quem-somos"
              className="inline-block bg-white/10 backdrop-blur-sm text-white border border-white/20 px-10 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all"
            >
              Saiba Mais
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
