import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Resend } from "resend"
import crypto from "crypto"

const resend = new Resend(process.env.RESEND_API_KEY)

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

    await resend.emails.send({
      from: "Núcleo VIP <onboarding@resend.dev>",
      to: email,
      subject: "Recuperação de Senha - Núcleo VIP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Recuperação de Senha</h2>
          <p style="color: #666; line-height: 1.6;">
            Você solicitou a recuperação de senha da sua conta no Núcleo VIP.
          </p>
          <p style="color: #666; line-height: 1.6;">
            Clique no botão abaixo para criar uma nova senha:
          </p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 16px 0;">
            Redefinir Senha
          </a>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">
            Este link expira em 1 hora. Se você não solicitou esta recuperação, ignore este email.
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Erro ao enviar email" }, { status: 500 })
  }
}