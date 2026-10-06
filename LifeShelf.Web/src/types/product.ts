export interface Product {
  id: number
  name: string
  brand: string
  category: string
  subcategory: string | null
  price: number | null
  quantity: number | null
  unit: string | null
  purchaseDate: string | null
  openedDate: string | null
  expirationDate: string | null
  expectedDurationDays: number | null
  usageFrequency: string | null
  notes: string | null
  createdAt: string
}