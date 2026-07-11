import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Política de privacidade da Núcleo VIP em conformidade com a LGPD. Saiba como tratamos seus dados pessoais.",
  alternates: { canonical: "/privacidade" },
  openGraph: { title: "Política de Privacidade | Núcleo VIP" },
}

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-gray-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Política de Privacidade</h1>
          <p className="text-primary-200">Última atualização: Julho de 2026</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introdução</h2>
            <p className="text-gray-600 leading-relaxed">
              A Núcleo VIP ("nós", "nosso" ou "plataforma") leva a privacidade dos seus usuários a sério.
              Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos seus
              dados pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Dados que Coletamos</h2>
            <p className="text-gray-600 leading-relaxed mb-3">Podemos coletar os seguintes dados pessoais:</p>
            <ul className="text-gray-600 leading-relaxed space-y-2 list-disc pl-5">
              <li><strong>Dados de cadastro:</strong> nome completo, endereço de e-mail e senha.</li>
              <li><strong>Dados de perfil:</strong> nome de produtor, biografia, foto, e demais informações fornecidas voluntariamente.</li>
              <li><strong>Dados de pagamento:</strong> processados exclusivamente pelo Stripe. Não armazenamos números de cartão, dados bancários ou informações sensíveis de pagamento.</li>
              <li><strong>Dados de navegação:</strong> endereço IP, tipo de navegador, páginas acessadas, tempo de sessão e cookies essenciais.</li>
              <li><strong>Dados de comunicação:</strong> mensagens trocadas com nosso suporte e interações na plataforma.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Como Usamos seus Dados</h2>
            <p className="text-gray-600 leading-relaxed mb-3">Utilizamos seus dados para:</p>
            <ul className="text-gray-600 leading-relaxed space-y-2 list-disc pl-5">
              <li>Criar e gerenciar sua conta na plataforma.</li>
              <li>Processar transações e gerar relatórios financeiros.</li>
              <li>Fornecer acesso ao conteúdo adquirido.</li>
              <li>Enviar comunicações operacionais (confirmação de compra, notificações de vendas).</li>
              <li>Melhorar a experiência do usuário e a segurança da plataforma.</li>
              <li>Cumprir obrigações legais e regulatórias.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Compartilhamento de Dados</h2>
            <p className="text-gray-600 leading-relaxed">
              Não vendemos seus dados pessoais para terceiros. Podemos compartilhar dados estritamente
              necessários com:
            </p>
            <ul className="text-gray-600 leading-relaxed space-y-2 list-disc pl-5 mt-3">
              <li><strong>Stripe:</strong> processamento de pagamentos (sujeito à política de privacidade do Stripe).</li>
              <li><strong>Produtores:</strong> dados básicos do comprador (nome e e-mail) para liberação de acesso ao conteúdo.</li>
              <li><strong>Autoridades legais:</strong> quando exigido por lei ou ordem judicial.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              Utilizamos cookies essenciais para o funcionamento da plataforma, incluindo cookies de
              autenticação de sessão. Não utilizamos cookies de rastreamento para fins publicitários
              sem consentimento explícito.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Segurança dos Dados</h2>
            <p className="text-gray-600 leading-relaxed">
              Empregamos medidas técnicas e organizacionais para proteger seus dados, incluindo
              criptografia SSL/TLS em todas as comunicações, hash de senhas com bcrypt, e acesso
              restrito a dados pessoais apenas a colaboradores autorizados.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Retenção e Exclusão</h2>
            <p className="text-gray-600 leading-relaxed">
              Mantemos seus dados pessoais enquanto sua conta estiver ativa. Ao solicitar a exclusão
              da conta, os dados serão removidos em até 30 dias, exceto aqueles que precisamos reter
              para cumprimento de obrigações legais (como registros fiscais).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Seus Direitos (LGPD)</h2>
            <p className="text-gray-600 leading-relaxed mb-3">Como titular de dados, você tem direito a:</p>
            <ul className="text-gray-600 leading-relaxed space-y-2 list-disc pl-5">
              <li>Confirmar a existência de tratamento de seus dados.</li>
              <li>Acessar seus dados pessoais.</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados.</li>
              <li>Solicitar anonimização, bloqueio ou eliminação de dados desnecessários.</li>
              <li>Solicitar portabilidade dos dados a outro fornecedor.</li>
              <li>Revogar o consentimento a qualquer momento.</li>
              <li>Solicitar exclusão dos dados tratados com base no consentimento.</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              Para exercer seus direitos, entre em contato pelo e-mail:{' '}
              <a href="mailto:suporte-comprador@nucleovip.com.br" className="text-primary-600 hover:text-primary-700 font-medium">
                suporte-comprador@nucleovip.com.br
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Contato com o DPO</h2>
            <p className="text-gray-600 leading-relaxed">
              Nosso Encarregado de Proteção de Dados (DPO) pode ser contatado exclusivamente para
              questões relacionadas à privacidade e proteção de dados através do e-mail:{' '}
              <a href="mailto:suporte-comprador@nucleovip.com.br" className="text-primary-600 hover:text-primary-700 font-medium">
                suporte-comprador@nucleovip.com.br
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Alterações nesta Política</h2>
            <p className="text-gray-600 leading-relaxed">
              Reservamo-nos o direito de modificar esta política a qualquer momento. Alterações
              significativas serão comunicadas através da plataforma ou por e-mail. Recomendamos
              revisar esta página periodicamente.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
