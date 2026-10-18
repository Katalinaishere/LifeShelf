
const API_URL = 'http://localhost:5151/api/auth'

export interface RegisterRequest {
  displayName: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  token?: string
  accessToken?: string
  userId?: string
  email?: string
  displayName?: string
  message?: string
}

async function postAuth<T>(
  endpoint: string,
  data: RegisterRequest | LoginRequest
): Promise<T> {
  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Authentication failed (${response.status})`)
  }

  return response.json() as Promise<T>
}

export function register(
  data: RegisterRequest
): Promise<AuthResponse> {
  return postAuth<AuthResponse>('register', data)
}

export function login(
  data: LoginRequest
): Promise<AuthResponse> {
  return postAuth<AuthResponse>('login', data)
}
