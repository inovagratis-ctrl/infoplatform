import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { put } from "@vercel/blob"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get("file") as File

  if (!file) {
    return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Tipo de arquivo nao permitido. Use JPG, PNG, GIF ou WebP" }, { status: 400 })
  }

  if (file.size > 4 * 1024 * 1024) {
    return NextResponse.json({ error: "Arquivo muito grande. Maximo 4MB" }, { status: 400 })
  }

  const ext = file.name.split(".").pop() || "jpg"
  const filename = `products/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`

  const blob = await put(filename, file, {
    access: "public",
  })

  return NextResponse.json({ url: blob.url })
}
