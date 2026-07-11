import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { hash, compare } from "bcryptjs"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      cpf: true,
      role: true,
      producerName: true,
      producerBio: true,
      pixKey: true,
      pixKeyType: true,
      createdAt: true,
    },
  })

  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
  }

  return NextResponse.json(user)
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  const data = await req.json()
  const { name, phone, producerName, producerBio, pixKey, pixKeyType, currentPassword, newPassword } = data

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
  }

  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json({ error: "Senha atual obrigatória para alterar a senha" }, { status: 400 })
    }
    if (user.password) {
      const isValid = await compare(currentPassword, user.password)
      if (!isValid) {
        return NextResponse.json({ error: "Senha atual incorreta" }, { status: 400 })
      }
    }
    const hashedPassword = await hash(newPassword, 12)
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: name ?? user.name,
      phone: phone ?? user.phone,
      producerName: producerName ?? user.producerName,
      producerBio: producerBio ?? user.producerBio,
      pixKey: pixKey ?? user.pixKey,
      pixKeyType: pixKeyType ?? user.pixKeyType,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      cpf: true,
      role: true,
      producerName: true,
      producerBio: true,
      pixKey: true,
      pixKeyType: true,
    },
  })

  return NextResponse.json(updated)
}
