import { prisma } from "@/lib/prisma"
import Link from "next/link"

const roleLabels: Record<string, string> = {
  admin: "Admin",
  producer: "Produtor",
  affiliate: "Afiliado",
  user: "Comprador",
}

const roleColors: Record<string, string> = {
  admin: "bg-purple-100 text-purple-700",
  producer: "bg-blue-100 text-blue-700",
  affiliate: "bg-green-100 text-green-700",
  user: "bg-gray-100 text-gray-600",
}

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { products: true, orders: true, earnings: true } },
      affiliate: { select: { referralCode: true, commissionRate: true } },
    },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
        <p className="text-gray-500 mt-1">{users.length} usuario{users.length !== 1 ? "s" : ""} cadastrado{users.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Nome</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">CPF</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Produtos</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Pedidos</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Cadastro</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name || "—"}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.cpf || "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${roleColors[user.role] || "bg-gray-100 text-gray-600"}`}>
                      {roleLabels[user.role] || user.role}
                    </span>
                    {user.affiliate && (
                      <span className="ml-1 text-xs text-gray-400">({user.affiliate.referralCode})</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user._count.products}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user._count.orders}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString("pt-BR")}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/dashboard/users/${user.id}/edit`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-500">Nenhum usuario encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
