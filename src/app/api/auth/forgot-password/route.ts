import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ success: true })
    }

    await prisma.passwordResetToken.deleteMany({ where: { email } })

    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    await prisma.passwordResetToken.create({
      data: { email, token, expiresAt },
    })

    const resetUrl = `${process.env.APP_URL || "https://nucleovip.com.br"}/reset-password?token=${token}`

    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_ACCESS_KEY || "46acd572-d430-455d-b3f6-6aa63e8d2036",
        name: "Núcleo VIP",
        email: email,
        subject: "[Núcleo VIP] Recuperação de Senha",
        message: `Você solicitou a recuperação de senha. Clique no link abaixo para criar uma nova senha:\n\n${resetUrl}\n\nEste link expira em 1 hora.\n\nSe você não solicitou esta recuperação, ignore este email.`,
        from_name: "Núcleo VIP",
        replyto: email,
      }),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Erro ao processar solicitação" }, { status: 500 })
  }
}