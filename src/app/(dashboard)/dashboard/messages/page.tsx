import { prisma } from "@/lib/prisma"

const roleLabels: Record<string, string> = {
  producer: "🎓 Produtor",
  buyer: "👤 Comprador",
  affiliate: "🚀 Afiliado",
  other: "💬 Outro",
}

const subjectLabels: Record<string, string> = {
  "criar-produto": "Criação de produto",
  "vendas": "Dúvidas sobre vendas",
  "pagamento": "Pagamento e repasses",
  "suporte-tecnico": "Suporte técnico",
  "acesso": "Problemas de acesso",
  "reembolso": "Solicitar reembolso",
  "link": "Link de afiliado",
  "comissao": "Dúvidas sobre comissão",
  "parceria": "Proposta de parceria",
  "imprensa": "Imprensa",
  "reclamacao": "Reclamação",
  "outro": "Outro assunto",
}

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mensagens</h1>
        <p className="text-gray-500 mt-1">{messages.length} mensagen{messages.length !== 1 ? "ns" : ""} recebida{messages.length !== 1 ? "s" : ""}</p>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="text-5xl mb-4">✉️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma mensagem ainda</h3>
          <p className="text-gray-500">As mensagens do formulário de contato aparecerão aqui.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{msg.name}</p>
                  <a href={`mailto:${msg.email}`} className="text-sm text-primary-600 hover:text-primary-700">{msg.email}</a>
                </div>
                <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleString("pt-BR")}</span>
              </div>
              <div className="flex gap-2 mb-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
                  {roleLabels[msg.role] || msg.role}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  {subjectLabels[msg.subject] || msg.subject}
                </span>
              </div>
              <p className="text-gray-600 text-sm whitespace-pre-wrap">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
