
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

// Attach the current session's token to API requests.
function getAuthHeaders(
  includeJsonContentType = false
): HeadersInit {
  const token = sessionStorage.getItem('lifeshelf_token')

  return {
    ...(includeJsonContentType
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function handleResponse(response: Response): Promise<void> {
  if (response.ok) return

  if (response.status === 401) {
    throw new Error('Your session has expired or you are not signed in. Please log in again.')
  }

  if (response.status === 403) {
    throw new Error('You do not have permission to perform this action.')
  }

  const message = await response.text()
  throw new Error(message || `Request failed (${response.status})`)
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(API_URL, {
    headers: getAuthHeaders(),
  })

  await handleResponse(response)
  return response.json()
}

export async function getProduct(id: number): Promise<Product> {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  })

  await handleResponse(response)
  return response.json()
}

export async function createProduct(
  product: CreateProduct
): Promise<Product> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(true),
    body: JSON.stringify(product),
  })

  await handleResponse(response)
  return response.json()
}

export async function updateProduct(
  id: number,
  product: CreateProduct
): Promise<Product> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(true),
    body: JSON.stringify(product),
  })

  await handleResponse(response)
  return response.json()
}

export async function deleteProduct(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })

  await handleResponse(response)
}
