
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../services/authService'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await login({ email, password })

      // Temporary until we connect authentication state
      // and protect the product API.
      if (response.token || response.accessToken) {
        sessionStorage.setItem(
          'lifeshelf_token',
          response.token ?? response.accessToken ?? ''
        )
      }

        navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to log in. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-[#dce9e4] bg-white/90 p-8 shadow-xl shadow-[#183533]/5 sm:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e5eee9] text-2xl text-[#24594f]">
            🌿
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-[#183533]">
            Welcome back
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#6b8079]">
            Sign in to continue managing your LifeShelf.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#183533]"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-[#dce5df] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#47796b] focus:ring-2 focus:ring-[#47796b]/15"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#183533]"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-[#dce5df] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#47796b] focus:ring-2 focus:ring-[#47796b]/15"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#24594f] px-4 py-3 font-medium text-white transition hover:bg-[#183f38] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6b8079]">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-[#24594f] hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
