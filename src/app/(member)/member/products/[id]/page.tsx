import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

export default async function ProductContentPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })
  if (!user) redirect("/login")

  const purchase = await prisma.purchase.findFirst({
    where: { userId: user.id, productId: params.id },
    include: { product: true },
  })

  if (!purchase) {
    redirect("/member")
  }

  const product = purchase.product
  const expired = purchase.expiresAt && new Date(purchase.expiresAt) < new Date()

  if (expired) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Expirado</h1>
        <p className="text-gray-600">Seu período de acesso a este produto expirou.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
      <p className="text-gray-600 mb-8">{product.description}</p>

      <div className="bg-gray-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center">
        {product.contentUrl ? (
          product.contentType === "video" ? (
            <video
              controls
              className="w-full h-full"
              src={product.contentUrl}
            >
              Seu navegador não suporta vídeo.
            </video>
          ) : product.contentType === "pdf" ? (
            <iframe src={product.contentUrl} className="w-full h-full" />
          ) : (
            <a
              href={product.contentUrl}
              target="_blank"
              className="text-white text-lg underline"
            >
              Acessar Material
            </a>
          )
        ) : (
          <div className="text-center text-gray-400">
            <p className="text-lg mb-2">Conteúdo sendo preparado</p>
            <p className="text-sm">Em breve você terá acesso ao material completo.</p>
          </div>
        )}
      </div>

      {purchase.expiresAt && (
        <p className="text-sm text-gray-500 mt-4">
          Acesso válido até {new Date(purchase.expiresAt).toLocaleDateString("pt-BR")}
        </p>
      )}
    </div>
  )
}
