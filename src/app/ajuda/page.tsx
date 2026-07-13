import type { Metadata } from "next"
import { LogoIcon } from "@/components/Logo"
import { ContactForm } from "./ContactForm"

export const metadata: Metadata = {
  title: "Central de Ajuda",
  description: "Tire suas dúvidas sobre a Núcleo VIP. FAQ, suporte para produtores, compradores e afiliados.",
  alternates: { canonical: "/ajuda" },
  openGraph: { title: "Central de Ajuda | Núcleo VIP", description: "Tire suas dúvidas sobre a plataforma Núcleo VIP." },
}

const faqs = [
  {
    question: "Como criar um produto na plataforma?",
    answer:
      "Após se cadastrar como produtor, acesse o painel do produtor e clique em 'Novo Produto'. Preencha as informações em 3 etapas: tipo, descrição, preço, conteúdo e pronto — seu produto estará disponível na vitrine.",
  },
  {
    question: "Quanto a plataforma cobra de taxa?",
    answer:
      "A Núcleo VIP cobra apenas 4,99% de taxa sobre cada venda (ou menos, conforme seu faturamento). As comissões de afiliados são descontadas do valor do produtor. Não há taxa de adesão ou mensalidade.",
  },
  {
    question: "Como recebo meus ganhos como produtor?",
    answer:
      "Os ganhos ficam registrados no painel do produtor. O pagamento segue a política de repasses definida na plataforma, com saques disponíveis conforme o saldo acumulado.",
  },
  {
    question: "Como funciona o link de afiliado?",
    answer:
      "Ao se cadastrar como afiliado, você recebe um código único de indicação. Compartilhe seu link com ?ref=SEUCODIGO e ganhe comissões sobre cada venda realizada através do seu link.",
  },
  {
    question: "Qual a taxa de comissão para afiliados?",
    answer:
      "A comissão padrão é de 10% sobre cada venda. Produtores podem configurar taxas personalizadas para seus produtos.",
  },
  {
    question: "Como funciona a área de membros?",
    answer:
      "Após a compra, o aluno tem acesso imediato ao conteúdo na área de membros. O acesso pode ser vitalício ou por assinatura, dependendo da configuração do produto.",
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer:
      "Aceitamos cartão de crédito (com parcelamento em até 12x), PIX (aprovação instantânea) e boleto bancário.",
  },
  {
    question: "Como funciona o reembolso?",
    answer:
      "O comprador tem até 7 dias para solicitar reembolso conforme o Código de Defesa do Consumidor. O estorno é processado integralmente.",
  },
]

const supportChannels = [
  {
    role: "Produtor",
    email: "inovagratis@gmail.com",
    icon: "🎓",
    description: "Dúvidas sobre criação de produtos, vendas, ganhos e comissões",
  },
  {
    role: "Comprador / Aluno",
    email: "inovagratis@gmail.com",
    icon: "👤",
    description: "Problemas de acesso, reembolsos, pagamentos e suporte técnico",
  },
  {
    role: "Afiliado",
    email: "inovagratis@gmail.com",
    icon: "🚀",
    description: "Dúvidas sobre links de afiliado, comissões e indicações",
  },
]

export default function HelpPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-gray-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <LogoIcon className="w-16 h-16" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Central de Ajuda</h1>
          <p className="text-xl text-primary-200">Estamos aqui para ajudar você</p>
        </div>
      </section>

      {/* Support Channels */}
      <section id="suporte" className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {supportChannels.map((channel) => (
            <div key={channel.role} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{channel.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{channel.role}</h3>
              <p className="text-sm text-gray-500 mb-3">{channel.description}</p>
              <a
                href={`mailto:${channel.email}`}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm break-all"
              >
                {channel.email}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Fale Conosco</h2>
          <p className="text-gray-500 text-center mb-8">Preencha o formulário abaixo e responderemos em breve</p>
          <ContactForm />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Perguntas Frequentes</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm group">
              <summary className="px-6 py-4 cursor-pointer text-gray-900 font-medium flex items-center justify-between hover:text-primary-600 transition-colors [&::-webkit-details-marker]:hidden">
                <span>{faq.question}</span>
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-4 text-gray-600 leading-relaxed">{faq.answer}</div>
            </details>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-gray-50 border-t border-gray-100 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Não encontrou o que precisa?</h2>
          <p className="text-gray-600 mb-8">Entre em contato diretamente com nosso time de suporte</p>
          <div className="flex flex-col items-center gap-3">
            {supportChannels.map((channel) => (
              <a
                key={channel.email}
                href={`mailto:${channel.email}`}
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
              >
                <span>{channel.icon}</span>
                {channel.email}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
