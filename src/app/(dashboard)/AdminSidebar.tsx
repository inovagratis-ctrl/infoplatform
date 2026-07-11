"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogoIcon } from "@/components/Logo"

const links = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/dashboard/products", label: "Produtos", icon: "📦" },
  { href: "/dashboard/orders", label: "Pedidos", icon: "💰" },
  { href: "/dashboard/users", label: "Usuários", icon: "👥" },
  { href: "/dashboard/affiliates", label: "Afiliados", icon: "🚀" },
  { href: "/dashboard/earnings", label: "Ganhos", icon: "📈" },
  { href: "/dashboard/messages", label: "Mensagens", icon: "✉️" },
  { href: "/dashboard/withdrawals", label: "Saques", icon: "💰" },
]

export function AdminSidebar() {
  const path = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 hidden lg:flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2">
          <LogoIcon className="w-8 h-8" />
          <div>
            <p className="text-sm font-bold text-gray-900">Núcleo VIP</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const isActive = path === link.href || (link.href !== "/dashboard" && path.startsWith(link.href))
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-gray-100">
        <Link href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar ao site
        </Link>
      </div>
    </aside>
  )
}
