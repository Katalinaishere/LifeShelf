
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/authService'

function Register() {
  const navigate = useNavigate()

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Your passwords do not match.')
      return
    }

    if (password.length < 8) {
      setError('Your password must contain at least 8 characters.')
      return
    }

    setLoading(true)

    try {
      const response = await register({
        displayName,
        email,
        password,
      })

      const token = response.token ?? response.accessToken

      if (!token) {
        setError(
          'Your account may have been created, but no token was returned. Please try signing in.'
        )
        return
      }

      sessionStorage.setItem('lifeshelf_token', token)

      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to create your account. Please try again.'
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
            Create your account
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#6b8079]">
            Start organizing your products with LifeShelf.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="displayName"
              className="mb-2 block text-sm font-medium text-[#183533]"
            >
              Your name
            </label>

            <input
              id="displayName"
              type="text"
              autoComplete="name"
              required
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border border-[#dce5df] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#47796b] focus:ring-2 focus:ring-[#47796b]/15"
            />
          </div>

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
              autoComplete="new-password"
              minLength={8}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              className="w-full rounded-xl border border-[#dce5df] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#47796b] focus:ring-2 focus:ring-[#47796b]/15"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-[#183533]"
            >
              Confirm password
            </label>

            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Enter your password again"
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
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6b8079]">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-[#24594f] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
