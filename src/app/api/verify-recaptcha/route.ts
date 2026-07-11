import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json({ error: "Token ausente" }, { status: 400 })
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY
    if (!secretKey) {
      return NextResponse.json({ error: "RECAPTCHA_SECRET_KEY não configurada" }, { status: 500 })
    }

    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`,
    })

    const data = await response.json()

    if (data.success && data.score >= 0.5) {
      return NextResponse.json({ success: true, score: data.score })
    }

    return NextResponse.json(
      { error: "Verificação reCAPTCHA falhou", score: data.score, details: data["error-codes"] },
      { status: 403 }
    )
  } catch {
    return NextResponse.json({ error: "Erro ao verificar reCAPTCHA" }, { status: 500 })
  }
}
