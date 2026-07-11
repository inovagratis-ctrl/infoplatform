import Link from "next/link"

export default function CancelPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Pagamento Cancelado</h1>
        <p className="text-gray-600 mb-8">
          O pagamento não foi concluído. Se desejar, tente novamente.
        </p>
        <Link
          href="/"
          className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700"
        >
          Voltar para Home
        </Link>
      </div>
    </div>
  )
}
