import { Logo } from "./Logo"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Logo showText size="md" variant="light" />
            <p className="text-sm text-gray-400 mt-4 leading-relaxed">
              A plataforma premium para criar e vender infoprodutos com segurança, tecnologia e resultados reais.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-white transition-colors">Início</a></li>
              <li><a href="/login" className="hover:text-white transition-colors">Entrar</a></li>
              <li><a href="/register" className="hover:text-white transition-colors">Cadastrar</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/quem-somos" className="hover:text-white transition-colors">Quem Somos</a></li>
              <li><a href="/ajuda" className="hover:text-white transition-colors">Central de Ajuda</a></li>
              <li><a href="/termos" className="hover:text-white transition-colors">Termos de Uso</a></li>
              <li><a href="/privacidade" className="hover:text-white transition-colors">Política de Privacidade</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          &copy; {new Date().getFullYear()} Núcleo VIP. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
