
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = 'http://localhost:5151/api/auth'

interface UserProfile {
  userId: string
  displayName: string
  email: string
  createdAt: string
}

interface Preferences {
  reminders: boolean
  expiryDays: string
  compactView: boolean
}

const DEFAULT_PREFERENCES: Preferences = {
  reminders: true,
  expiryDays: '30',
  compactView: false,
}

const PREFERENCES_KEY = 'lifeshelf_preferences'

function readPreferences(): Preferences {
  try {
    const saved = localStorage.getItem(PREFERENCES_KEY)

    if (!saved) return DEFAULT_PREFERENCES

    const parsed = JSON.parse(saved) as Partial<Preferences>
    const allowedDays = ['7', '14', '30', '60', '90']

    return {
      reminders:
        typeof parsed.reminders === 'boolean'
          ? parsed.reminders
          : DEFAULT_PREFERENCES.reminders,
      expiryDays: allowedDays.includes(parsed.expiryDays ?? '')
        ? parsed.expiryDays!
        : DEFAULT_PREFERENCES.expiryDays,
      compactView:
        typeof parsed.compactView === 'boolean'
          ? parsed.compactView
          : DEFAULT_PREFERENCES.compactView,
    }
  } catch {
    return DEFAULT_PREFERENCES
  }
}

function Settings() {
  const navigate = useNavigate()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileError, setProfileError] = useState('')

  const [preferences, setPreferences] =
    useState<Preferences>(readPreferences)

  const { reminders, expiryDays, compactView } = preferences

  useEffect(() => {
    let cancelled = false

    async function loadProfile() {
      const token = sessionStorage.getItem('lifeshelf_token')

      if (!token) {
        navigate('/login', { replace: true })
        return
      }

      try {
        const response = await fetch(`${API_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.status === 401) {
          sessionStorage.removeItem('lifeshelf_token')
          if (!cancelled) navigate('/login', { replace: true })
          return
        }

        if (!response.ok) {
          throw new Error('Could not load your profile. Please try again.')
        }

        const data: UserProfile = await response.json()

        if (!cancelled) {
          setProfile(data)
          setProfileError('')
        }
      } catch (error) {
        if (!cancelled) {
          setProfileError(
            error instanceof Error
              ? error.message
              : 'Could not load your profile.'
          )
        }
      } finally {
        if (!cancelled) setProfileLoading(false)
      }
    }

    void loadProfile()

    return () => {
      cancelled = true
    }
  }, [navigate])

  useEffect(() => {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences))
  }, [preferences])

  function updatePreference<K extends keyof Preferences>(
    key: K,
    value: Preferences[K]
  ) {
    setPreferences((current) => ({
      ...current,
      [key]: value,
    }))
  }

  function handleExportPreferences() {
    const data = {
      exportedAt: new Date().toISOString(),
      preferences,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'lifeshelf-preferences.json'
    link.click()

    URL.revokeObjectURL(url)
  }

  function handleLogout() {
    sessionStorage.removeItem('lifeshelf_token')
    navigate('/login', { replace: true })
  }

  const initials = (profile?.displayName || profile?.email || '?')
    .trim()
    .charAt(0)
    .toUpperCase()

  return (
    <div className="w-full">
      <header className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#71817d]">
          Preferences
        </p>

        <h1 className="text-3xl font-light tracking-[-0.04em] text-[#183533] sm:text-4xl">
          Settings
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#71817d]">
          Adjust how LifeShelf organizes your collection and keeps you informed.
        </p>
      </header>

      <div className="grid w-full gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)]">
        <div className="min-w-0 space-y-6">
          {/* Profile */}
          <section className="rounded-[24px] border border-white/75 bg-white/50 p-6 shadow-[0_12px_35px_rgba(24,53,51,0.05)] backdrop-blur-2xl">
            <div className="mb-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#71817d]">
                Profile
              </p>

              <h2 className="mt-2 text-lg font-medium tracking-[-0.02em] text-[#183533]">
                Your shelf
              </h2>
            </div>

            {profileLoading ? (
              <p className="text-sm text-[#71817d]">Loading your profile...</p>
            ) : profileError ? (
              <div>
                <p role="alert" className="text-sm text-[#a05243]">
                  {profileError}
                </p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-3 text-sm font-medium text-[#24594f] underline"
                >
                  Try again
                </button>
              </div>
            ) : profile ? (
              <>
                <div className="flex items-center gap-5">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] border border-white/80 bg-[#dce9e4]/75 text-xl font-light text-[#24594f]">
                    {initials}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="mb-2 text-xs font-medium text-[#71817d]">
                      Display name
                    </p>
                    <p className="truncate text-base font-medium text-[#183533]">
                      {profile.displayName || 'No display name'}
                    </p>
                    <p className="mt-1 break-all text-sm text-[#71817d]">
                      {profile.email}
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t border-[#dce7e3]/70 pt-4">
                  <p className="text-xs text-[#71817d]">Account created</p>
                  <p className="mt-1 text-sm text-[#183533]">
                    {profile.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString(
                          undefined,
                          {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          }
                        )
                      : 'Not available'}
                  </p>
                </div>

                <p className="mt-4 text-xs leading-5 text-[#71817d]">
                  Your profile details come from your LifeShelf account.
                  Profile editing can be added next.
                </p>
              </>
            ) : null}
          </section>

          {/* Reminders */}
          <section className="rounded-[24px] border border-white/75 bg-white/50 p-6 shadow-[0_12px_35px_rgba(24,53,51,0.05)] backdrop-blur-2xl">
            <div className="mb-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#71817d]">
                Shelf reminders
              </p>

              <h2 className="mt-2 text-lg font-medium tracking-[-0.02em] text-[#183533]">
                Stay ahead of expiration
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#71817d]">
                Choose how LifeShelf should handle products that are getting
                close to expiration.
              </p>
            </div>

            <div className="divide-y divide-[#dce7e3]/70">
              <div className="flex items-center justify-between gap-6 py-5">
                <div>
                  <p className="text-sm font-medium text-[#183533]">
                    Expiration reminders
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#71817d]">
                    Highlight products that are approaching expiration.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-label="Expiration reminders"
                  aria-checked={reminders}
                  onClick={() => updatePreference('reminders', !reminders)}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ${
                    reminders ? 'bg-[#24594f]' : 'bg-[#cbd7d3]'
                  }`}
                >
                  <span
                    className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                      reminders ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between gap-6 py-5">
                <div>
                  <p className="text-sm font-medium text-[#183533]">
                    Expiration window
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#71817d]">
                    When a product should start appearing as coming up.
                  </p>
                </div>

                <select
                  aria-label="Expiration window"
                  value={expiryDays}
                  onChange={(event) =>
                    updatePreference('expiryDays', event.target.value)
                  }
                  className="shrink-0 rounded-[11px] border border-[#dce7e3] bg-white/65 px-3 py-2 text-sm text-[#183533] outline-none focus:border-[#24594f]/30 focus:ring-2 focus:ring-[#dce9e4]"
                >
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                </select>
              </div>
            </div>

            <p className="text-xs text-[#71817d]">
              Preferences are saved automatically on this browser.
            </p>
          </section>

          {/* Display */}
          <section className="rounded-[24px] border border-white/75 bg-white/50 p-6 shadow-[0_12px_35px_rgba(24,53,51,0.05)] backdrop-blur-2xl">
            <div className="mb-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#71817d]">
                Display
              </p>

              <h2 className="mt-2 text-lg font-medium tracking-[-0.02em] text-[#183533]">
                Collection view
              </h2>
            </div>

            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="text-sm font-medium text-[#183533]">
                  Compact product view
                </p>
                <p className="mt-1 text-xs leading-5 text-[#71817d]">
                  Use a denser layout when browsing your products.
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-label="Compact product view"
                aria-checked={compactView}
                onClick={() =>
                  updatePreference('compactView', !compactView)
                }
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ${
                  compactView ? 'bg-[#24594f]' : 'bg-[#cbd7d3]'
                }`}
              >
                <span
                  className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    compactView ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="min-w-0 space-y-6">
          <section className="rounded-[24px] border border-[#24594f]/10 bg-[#24594f]/[0.92] p-6 text-white shadow-[0_16px_40px_rgba(36,89,79,0.10)]">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/55">
              LifeShelf
            </p>

            <h2 className="mt-4 text-2xl font-light leading-tight tracking-[-0.03em]">
              Your personal
              <br />
              product shelf.
            </h2>

            <p className="mt-4 text-sm leading-6 text-white/65">
              Keep track of what you own, how long it lasts, and what needs
              attention next.
            </p>

            <div className="mt-7 border-t border-white/10 pt-4">
              <p className="text-[11px] text-white/45">Version</p>
              <p className="mt-1 text-sm text-white/75">1.0.0</p>
            </div>
          </section>

          {/* Data management */}
          <section className="rounded-[24px] border border-white/75 bg-white/50 p-6 shadow-[0_12px_35px_rgba(24,53,51,0.05)] backdrop-blur-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#71817d]">
              Your data
            </p>

            <h2 className="mt-2 text-lg font-medium tracking-[-0.02em] text-[#183533]">
              Data management
            </h2>

            <div className="mt-5 space-y-2.5">
              <button
                type="button"
                onClick={handleExportPreferences}
                className="w-full rounded-[11px] border border-[#dce7e3] bg-white/55 px-4 py-2.5 text-left text-sm font-medium text-[#24594f] transition hover:bg-white/80"
              >
                Export my preferences
              </button>

              <p className="text-xs leading-5 text-[#71817d]">
                This exports your settings only, not your product collection.
              </p>
            </div>
          </section>

          {/* Account */}
          <section className="rounded-[24px] border border-white/75 bg-white/50 p-6 shadow-[0_12px_35px_rgba(24,53,51,0.05)] backdrop-blur-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#71817d]">
              Account
            </p>

            <h2 className="mt-2 text-lg font-medium tracking-[-0.02em] text-[#183533]">
              Sign out
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#71817d]">
              Sign out of this LifeShelf session on this browser.
            </p>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-5 w-full rounded-[11px] border border-[#e8d8d3] bg-[#fff9f7]/60 px-4 py-2.5 text-left text-sm font-medium text-[#a05243] transition hover:bg-[#fff9f7]"
            >
              Log out
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Settings
