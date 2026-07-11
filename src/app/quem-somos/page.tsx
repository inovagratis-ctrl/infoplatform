import type { Metadata } from "next"
import { LogoIcon } from "@/components/Logo"

export const metadata: Metadata = {
  title: "Quem Somos",
  description: "Conheça a história da Núcleo VIP, a plataforma de infoprodutos com taxas justas e tecnologia brasileira.",
  alternates: { canonical: "/quem-somos" },
  openGraph: { title: "Quem Somos | Núcleo VIP", description: "Conheça a Núcleo VIP, plataforma de infoprodutos premium." },
}

const values = [
  {
    icon: "⚡",
    title: "Tecnologia que Transforma",
    desc: "Acreditamos que a tecnologia certa pode transformar conhecimento em renda. Por isso, construímos uma plataforma robusta e intuitiva para criadores de conteúdo.",
  },
  {
    icon: "🤝",
    title: "Parceria com o Criador",
    desc: "Diferente das grandes plataformas que cobram taxas abusivas, a Núcleo VIP fica com apenas 5%. Nosso sucesso está ligado ao seu sucesso.",
  },
  {
    icon: "🇧🇷",
    title: "Feito para o Brasil",
    desc: "Pagamentos em PIX, boleto e parcelamento. Suporte em português. Taxas justas. Uma plataforma que entende a realidade do empreendedor brasileiro.",
  },
  {
    icon: "🔒",
    title: "Segurança e Transparência",
    desc: "Processamento via Stripe, criptografia de ponta a ponta e conformidade com a LGPD. Seus dados e sua receita protegidos.",
  },
]

const team = [
  { name: "Equipe Núcleo VIP", role: "Fundadores & Desenvolvimento" },
  { name: "Suporte ao Produtor", role: "suporte-produtor@nucleovip.com.br" },
  { name: "Suporte ao Comprador", role: "suporte-comprador@nucleovip.com.br" },
  { name: "Suporte ao Afiliado", role: "suporte-afiliados@nucleovip.com.br" },
]

export default function QuemSomosPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-gray-900 text-white py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <LogoIcon className="w-20 h-20" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Quem Somos
          </h1>
          <p className="text-xl text-primary-200 max-w-2xl mx-auto leading-relaxed">
            A Núcleo VIP nasceu para revolucionar a forma como criadores de conteúdo
            vendem seus infoprodutos no Brasil.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Nossa História</h2>
        <div className="text-gray-600 leading-relaxed space-y-4">
          <p>
            A Núcleo VIP foi criada por empreendedores que sentiram na pele as dificuldades de vender
            infoprodutos no Brasil. Taxas abusivas, burocracia, falta de suporte e ferramentas
            complexas demais — tudo isso nos motivou a construir algo diferente.
          </p>
          <p>
            Nosso objetivo é simples: oferecer a melhor plataforma para criadores de conteúdo
            brasileiros, com taxas justas, checkout inteligente e uma experiência que realmente
            funciona. Não queremos ser mais uma plataforma — queremos ser a melhor parceira
            do seu negócio digital.
          </p>
          <p>
            Somos uma equipe apaixonada por tecnologia, educação e empreendedorismo. Cada
            funcionalidade é pensada para resolver problemas reais de produtores, afiliados e
            alunos. Da criação do produto à entrega do conteúdo, estamos juntos em cada etapa.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 border-t border-b border-gray-100 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">Nossos Valores</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">Núcleo VIP em Números</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6">
            <p className="text-3xl font-bold text-primary-600">5%</p>
            <p className="text-sm text-gray-500 mt-1">Taxa da plataforma</p>
          </div>
          <div className="text-center p-6">
            <p className="text-3xl font-bold text-primary-600">95%</p>
            <p className="text-sm text-gray-500 mt-1">Para o produtor</p>
          </div>
          <div className="text-center p-6">
            <p className="text-3xl font-bold text-primary-600">PIX</p>
            <p className="text-sm text-gray-500 mt-1">Pagamento instantâneo</p>
          </div>
          <div className="text-center p-6">
            <p className="text-3xl font-bold text-primary-600">12x</p>
            <p className="text-sm text-gray-500 mt-1">Parcelamento no cartão</p>
          </div>
        </div>
      </section>

      {/* Team / Contact */}
      <section className="bg-primary-900 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-6">Entre em Contato</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {team.slice(1).map((member) => (
              <div key={member.role} className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <p className="text-lg mb-1">✉️</p>
                <p className="text-white/80 text-sm mb-1">{member.name}</p>
                <a href={`mailto:${member.role}`} className="text-primary-300 hover:text-primary-200 text-sm font-medium">
                  {member.role}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
