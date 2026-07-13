import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, role, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Nome, email e mensagem são obrigatórios" }, { status: 400 })
    }

    // Enviar via Web3Forms (gratuito)
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_ACCESS_KEY || "46acd572-d430-455d-b3f6-6aa63e8d2036",
        name,
        email,
        subject: `[Núcleo VIP] ${subject || "Contato"}`,
        message: `
Perfil: ${role || "Não informado"}
Assunto: ${subject || "Não informado"}

Mensagem:
${message}
        `.trim(),
        from_name: "Núcleo VIP",
        replyto: email,
      }),
    })

    const result = await response.json()

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      console.error("Web3Forms error:", result)
      return NextResponse.json({ error: "Erro ao enviar mensagem" }, { status: 500 })
    }
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Erro ao processar solicitação" }, { status: 500 })
  }
}
