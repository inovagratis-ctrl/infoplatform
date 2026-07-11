import Link from "next/link"

interface ProductCardProps {
  id: string
  title: string
  description: string
  price: number
  comparePrice?: number | null
  imageUrl?: string | null
  purchased?: boolean
  producerName?: string | null
}

export function ProductCard({ id, title, description, price, comparePrice, imageUrl, purchased, producerName }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {imageUrl ? (
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
          <span className="text-4xl font-bold text-white">{title[0]}</span>
        </div>
      )}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        {producerName && <p className="text-xs text-gray-500 mb-1">Por {producerName}</p>}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center mb-4">
          <span className="text-2xl font-bold text-gray-900">
            {price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </span>
          {comparePrice && comparePrice > price && (
            <span className="ml-2 text-sm text-gray-400 line-through">
              {comparePrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </span>
          )}
        </div>
        {purchased ? (
          <Link
            href={`/member/products/${id}`}
            className="block w-full text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Acessar Conteúdo
          </Link>
        ) : (
          <Link
            href={`/checkout/${id}`}
            className="block w-full text-center bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
          >
            Comprar Agora
          </Link>
        )}
      </div>
    </div>
  )
}
