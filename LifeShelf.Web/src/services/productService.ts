import type { Product } from '../types/product'

const API_URL = 'http://localhost:5151/api/products'

export interface CreateProduct {
  name: string
  brand: string
  category: string
  subcategory?: string
  price?: number
  quantity?: number
  unit?: string
  purchaseDate?: string
  openedDate?: string
  expirationDate?: string
  expectedDurationDays?: number
  usageFrequency?: string
  notes?: string
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }

  return response.json()
}

export async function getProduct(
  id: number
): Promise<Product> {
  const response = await fetch(`${API_URL}/${id}`)

  if (!response.ok) {
    throw new Error('Failed to fetch product')
  }

  return response.json()
}

export async function createProduct(
  product: CreateProduct
): Promise<Product> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  })

  if (!response.ok) {
    throw new Error('Failed to create product')
  }

  return response.json()
}

export async function updateProduct(
  id: number,
  product: CreateProduct
): Promise<Product> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  })

  if (!response.ok) {
    throw new Error('Failed to update product')
  }

  return response.json()
}

export async function deleteProduct(
  id: number
): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete product')
  }
}