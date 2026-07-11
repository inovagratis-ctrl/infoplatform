"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"
import { Logo } from "./Logo"

export function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const user = session?.user as any

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Logo />
            <div className="hidden md:flex ml-10 space-x-8">
              <Link href="/" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                Início
              </Link>
              <Link href="#taxas" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                Taxas
              </Link>
              <Link href="/quem-somos" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                Sobre Nós
              </Link>
              <Link href="/register" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                Criar Produto
              </Link>
              <Link href="/ajuda" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                FAQ
              </Link>
              <Link href="/ajuda#suporte" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                Ajuda
              </Link>
              {session && (
                <Link href="/member" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                  Meus Produtos
                </Link>
              )}
              {session && (
                <Link href="/member/profile" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                  Meu Perfil
                </Link>
              )}
              {(user?.role === "producer" || user?.role === "admin") && (
                <Link href="/producer" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                  Produtor
                </Link>
              )}
              {user?.role === "admin" && (
                <Link href="/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                  Admin
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                {user?.role === "affiliate" && (
                  <Link href="/affiliate" className="hidden md:block text-sm bg-vip-50 text-vip-700 px-3 py-1.5 rounded-full font-medium border border-vip-200">
                    🚀 Afiliado
                  </Link>
                )}
                <span className="text-sm text-gray-500 hidden md:block">{user?.name || user?.email}</span>
                <button
                  onClick={() => signOut()}
                  className="text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg border border-gray-200 transition-colors"
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-sm text-gray-600 hover:text-primary-600 font-medium transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="text-sm bg-gradient-to-r from-primary-600 to-primary-700 text-white px-5 py-2 rounded-lg hover:from-primary-700 hover:to-primary-800 shadow-md shadow-primary-200 transition-all"
                >
                  Cadastrar
                </Link>
              </div>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 px-4 py-4 space-y-3 bg-white">
          <Link href="/" className="block text-gray-600 font-medium">Início</Link>
          <Link href="#taxas" className="block text-gray-600 font-medium">Taxas</Link>
          <Link href="/quem-somos" className="block text-gray-600 font-medium">Sobre Nós</Link>
          <Link href="/register" className="block text-gray-600 font-medium">Criar Produto</Link>
          <Link href="/ajuda" className="block text-gray-600 font-medium">FAQ</Link>
          <Link href="/ajuda#suporte" className="block text-gray-600 font-medium">Ajuda</Link>
          {session && <Link href="/member" className="block text-gray-600 font-medium">Meus Produtos</Link>}
          {session && <Link href="/member/profile" className="block text-gray-600 font-medium">Meu Perfil</Link>}
          {(user?.role === "producer" || user?.role === "admin") && <Link href="/producer" className="block text-gray-600 font-medium">Produtor</Link>}
          {user?.role === "admin" && <Link href="/dashboard" className="block text-gray-600 font-medium">Admin</Link>}
          {user?.role === "affiliate" && <Link href="/affiliate" className="block text-vip-700 font-medium">🚀 Afiliado</Link>}
        </div>
      )}
    </nav>
  )
}
