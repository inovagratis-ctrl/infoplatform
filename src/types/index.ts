export interface ProductWithStatus {
  id: string
  title: string
  description: string
  price: number
  comparePrice: number | null
  imageUrl: string | null
  contentType: string
  isSubscription: boolean
  published: boolean
  createdAt: Date
  purchased?: boolean
}

export interface OrderWithProduct {
  id: string
  amount: number
  status: string
  paymentMethod: string | null
  createdAt: Date
  product: {
    id: string
    title: string
    imageUrl: string | null
  }
}
