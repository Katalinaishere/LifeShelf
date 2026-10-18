
export interface UsageLog {
  id: number
  productId: number
  date: string
  amountUsed: number
  unit: string
  notes: string | null
}

export interface CreateUsageLog {
  productId: number
  date: string
  amountUsed: number
  unit: string
  notes?: string
}

const API_URL = 'http://localhost:5151/api/usage-logs'

function getAuthHeaders(includeJsonContentType = false): HeadersInit {
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
    throw new Error(
      'Your session has expired or you are not signed in. Please log in again.',
    )
  }

  if (response.status === 403) {
    throw new Error('You do not have permission to perform this action.')
  }

  const message = await response.text()
  throw new Error(message || `Request failed (${response.status})`)
}

export async function getUsageLogs(
  productId: number,
): Promise<UsageLog[]> {
  const response = await fetch(`${API_URL}/product/${productId}`, {
    headers: getAuthHeaders(),
  })

  await handleResponse(response)
  return response.json()
}

export async function createUsageLog(
  log: CreateUsageLog,
): Promise<UsageLog> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(true),
    body: JSON.stringify(log),
  })

  await handleResponse(response)
  return response.json()
}

export async function deleteUsageLog(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })

  await handleResponse(response)
}
