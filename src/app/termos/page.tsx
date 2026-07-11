import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos e condições de uso da plataforma Núcleo VIP. Saiba seus direitos e deveres ao utilizar nossos serviços.",
  alternates: { canonical: "/termos" },
  openGraph: { title: "Termos de Uso | Núcleo VIP" },
}

export default function TermosPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-gray-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Termos de Uso</h1>
          <p className="text-primary-200">Última atualização: Julho de 2026</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Aceitação dos Termos</h2>
            <p className="text-gray-600 leading-relaxed">
              Ao acessar ou utilizar a plataforma Núcleo VIP, você concorda integralmente com estes Termos de Uso.
              Caso não concorde com qualquer parte destes termos, não utilize nossos serviços.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Definições</h2>
            <ul className="text-gray-600 leading-relaxed space-y-2 list-disc pl-5">
              <li><strong>Plataforma:</strong> Núcleo VIP, serviço de hospedagem e venda de infoprodutos digitais.</li>
              <li><strong>Produtor:</strong> Usuário que cria e disponibiliza conteúdo digital para venda.</li>
              <li><strong>Comprador/Aluno:</strong> Usuário que adquire e consome o conteúdo digital.</li>
              <li><strong>Afiliado:</strong> Usuário que promove produtos e recebe comissão por vendas realizadas.</li>
              <li><strong>Conteúdo Digital:</strong> Cursos, e-books, mentorias, comunidades e demais produtos digitais.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Cadastro e Conta</h2>
            <p className="text-gray-600 leading-relaxed">
              O usuário é responsável pela veracidade dos dados fornecidos no cadastro e pela segurança de sua senha.
              A Núcleo VIP não se responsabiliza por acessos indevidos decorrentes de negligência do usuário.
              É vedado o cadastro de menores de 18 anos sem autorização dos responsáveis legais.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Produtos e Conteúdo</h2>
            <p className="text-gray-600 leading-relaxed">
              O produtor é o único responsável pelo conteúdo publicado na plataforma, incluindo sua originalidade,
              licenciamento e conformidade legal. A Núcleo VIP não realiza curadoria prévia de conteúdo, mas
              reserva-se o direito de remover qualquer material que viole estes termos ou a legislação vigente.
            </p>
            <p className="text-gray-600 leading-relaxed mt-3">
              É proibida a publicação de conteúdo que: promova violência, discurso de ódio, nudez explícita,
              materiais protegidos por direitos autorais sem autorização, ou qualquer conteúdo ilegal.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Transações Financeiras</h2>
            <p className="text-gray-600 leading-relaxed">
              O processamento de pagamentos é realizado exclusivamente pelo Stripe. A Núcleo VIP não armazena
              dados de cartão de crédito ou informações bancárias sensíveis.
            </p>
            <ul className="text-gray-600 leading-relaxed space-y-2 list-disc pl-5 mt-3">
              <li>O produtor recebe até 97,01% do valor da venda, deduzida a comissão de afiliados quando aplicável.</li>
              <li>A plataforma retém até 2,99% como taxa de serviço (varia conforme faturamento).</li>
              <li>Os repasses seguem o cronograma estabelecido pelo processador de pagamentos.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Afiliados</h2>
            <p className="text-gray-600 leading-relaxed">
              O afiliado não possui vínculo empregatício com a Núcleo VIP ou com os produtores.
              A comissão é gerada exclusivamente sobre vendas realizadas através do link de afiliado.
              É proibido o uso de spam, tráfego robótico ou qualquer prática ilegal para promoção de produtos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Reembolso e Cancelamento</h2>
            <p className="text-gray-600 leading-relaxed">
              Conforme o Código de Defesa do Consumidor (Art. 49), o comprador tem até 7 dias corridos
              para solicitar reembolso. O valor será estornado integralmente ao comprador, e o produtor
              terá o valor correspondente deduzido de seus ganhos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Propriedade Intelectual</h2>
            <p className="text-gray-600 leading-relaxed">
              Todo o conteúdo publicado na plataforma é de propriedade do produtor. A Núcleo VIP detém
              os direitos sobre a plataforma, seu código, identidade visual e marca. É proibida a
              reprodução, distribuição ou modificação não autorizada do conteúdo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Limitação de Responsabilidade</h2>
            <p className="text-gray-600 leading-relaxed">
              A Núcleo VIP atua como intermediária entre produtores e compradores. Não nos responsabilizamos
              pela qualidade, veracidade ou atualidade do conteúdo produzido por terceiros. A plataforma
              empreende esforços para manter o serviço disponível, mas não garante disponibilidade ininterrupta.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Disposições Gerais</h2>
            <p className="text-gray-600 leading-relaxed">
              Estes termos são regidos pela legislação brasileira. Fica eleito o foro da comarca de
              Brasília/DF para solução de controvérsias. A Núcleo VIP pode alterar estes termos a
              qualquer momento, notificando os usuários com 30 dias de antecedência.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
