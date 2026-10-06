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

export async function getUsageLogs(
  productId: number
): Promise<UsageLog[]> {
  const response = await fetch(
    `${API_URL}/product/${productId}`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch usage logs')
  }

  return response.json()
}

export async function createUsageLog(
  log: CreateUsageLog
): Promise<UsageLog> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(log),
  })

  if (!response.ok) {
    throw new Error('Failed to create usage log')
  }

  return response.json()
}

export async function deleteUsageLog(
  id: number
): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete usage log')
  }
}