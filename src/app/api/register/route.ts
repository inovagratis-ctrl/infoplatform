import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { isValidCPF, formatCPF } from "@/lib/cpf"

async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY
  if (!secretKey) return true

  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`,
  })

  const data = await response.json()
  return data.success && data.score >= 0.5
}

export async function POST(req: Request) {
  try {
    const { name, email, password, role, cpf, producerName, producerBio, captchaToken } = await req.json()

    if (captchaToken) {
      const isValid = await verifyRecaptcha(captchaToken)
      if (!isValid) {
        return NextResponse.json({ error: "Verificação reCAPTCHA falhou" }, { status: 403 })
      }
    }

    if (!cpf || !isValidCPF(cpf)) {
      return NextResponse.json({ error: "CPF inválido" }, { status: 400 })
    }

    const cleanCPF = cpf.replace(/\D/g, "")

    const [existingEmail, existingCPF] = await Promise.all([
      prisma.user.findUnique({ where: { email } }),
      prisma.user.findFirst({ where: { cpf: cleanCPF } }),
    ])
    if (existingEmail) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 })
    }
    if (existingCPF) {
      return NextResponse.json({ error: "CPF já cadastrado. Cada CPF permite apenas uma conta." }, { status: 400 })
    }

    const hashedPassword = password ? await hash(password, 12) : null
    const user = await prisma.user.create({
      data: {
        name,
        email,
        cpf: cleanCPF,
        password: hashedPassword,
        role: role || "user",
        producerName: role === "producer" ? producerName : null,
        producerBio: role === "producer" ? producerBio : null,
      },
    })

    if (role === "affiliate") {
      const code = (name || email).substring(0, 5).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase()
      await prisma.affiliate.create({
        data: {
          userId: user.id,
          referralCode: code,
          commissionRate: 10.0,
        },
      })
    }

    return NextResponse.json({ id: user.id, email: user.email, name: user.name, role: user.role })
  } catch {
    return NextResponse.json({ error: "Erro ao cadastrar" }, { status: 500 })
  }
}
