import { useState } from 'react'

function Settings() {
  const [reminders, setReminders] = useState(true)
  const [expiryDays, setExpiryDays] = useState('30')
  const [compactView, setCompactView] = useState(false)

  return (
    <div className="w-full">
      {/* Header */}
      <header className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#71817d]">
          Preferences
        </p>

        <h1 className="text-3xl font-light tracking-[-0.04em] text-[#183533] sm:text-4xl">
          Settings
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#71817d]">
          Adjust how LifeShelf organizes your collection and keeps you
          informed.
        </p>
      </header>

      {/* Settings layout */}
      <div className="grid w-full gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)]">
        {/* Main column */}
        <div className="min-w-0 space-y-6">
          {/* Profile */}
          <section
            className="
              rounded-[24px]
              border border-white/75
              bg-white/50
              p-6
              shadow-[0_12px_35px_rgba(24,53,51,0.05)]
              backdrop-blur-2xl
            "
          >
            <div className="mb-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#71817d]">
                Profile
              </p>

              <h2 className="mt-2 text-lg font-medium tracking-[-0.02em] text-[#183533]">
                Your shelf
              </h2>
            </div>

            <div className="flex items-center gap-5">
              <div
                className="
                  flex h-16 w-16 shrink-0 items-center justify-center
                  rounded-[20px]
                  border border-white/80
                  bg-[#dce9e4]/75
                  text-xl font-light
                  text-[#24594f]
                "
              >
                K
              </div>

              <div className="min-w-0 flex-1">
                <label
                  htmlFor="name"
                  className="mb-2 block text-xs font-medium text-[#71817d]"
                >
                  Name
                </label>

                <input
                  id="name"
                  type="text"
                  defaultValue="Kat"
                  className="
                    w-full
                    rounded-[12px]
                    border border-[#dce7e3]
                    bg-white/60
                    px-4 py-2.5
                    text-sm text-[#183533]
                    outline-none
                    transition
                    focus:border-[#24594f]/30
                    focus:bg-white/80
                    focus:ring-2
                    focus:ring-[#dce9e4]
                  "
                />
              </div>
            </div>
          </section>

          {/* Reminders */}
          <section
            className="
              rounded-[24px]
              border border-white/75
              bg-white/50
              p-6
              shadow-[0_12px_35px_rgba(24,53,51,0.05)]
              backdrop-blur-2xl
            "
          >
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
              {/* Reminder toggle */}
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
                  onClick={() => setReminders((current) => !current)}
                  aria-pressed={reminders}
                  className={`
                    relative h-7 w-12 shrink-0 rounded-full
                    transition-colors duration-200
                    ${reminders ? 'bg-[#24594f]' : 'bg-[#cbd7d3]'}
                  `}
                >
                  <span
                    className={`
                      absolute left-1 top-1
                      h-5 w-5 rounded-full bg-white
                      shadow-sm
                      transition-transform duration-200
                      ${reminders ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>

              {/* Expiration window */}
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
                  value={expiryDays}
                  onChange={(event) => setExpiryDays(event.target.value)}
                  className="
                    shrink-0
                    rounded-[11px]
                    border border-[#dce7e3]
                    bg-white/65
                    px-3 py-2
                    text-sm text-[#183533]
                    outline-none
                    focus:border-[#24594f]/30
                    focus:ring-2
                    focus:ring-[#dce9e4]
                  "
                >
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                </select>
              </div>
            </div>
          </section>

          {/* Display */}
          <section
            className="
              rounded-[24px]
              border border-white/75
              bg-white/50
              p-6
              shadow-[0_12px_35px_rgba(24,53,51,0.05)]
              backdrop-blur-2xl
            "
          >
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
                onClick={() => setCompactView((current) => !current)}
                aria-pressed={compactView}
                className={`
                  relative h-7 w-12 shrink-0 rounded-full
                  transition-colors duration-200
                  ${compactView ? 'bg-[#24594f]' : 'bg-[#cbd7d3]'}
                `}
              >
                <span
                  className={`
                    absolute left-1 top-1
                    h-5 w-5 rounded-full bg-white
                    shadow-sm
                    transition-transform duration-200
                    ${compactView ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="min-w-0 space-y-6">
          {/* LifeShelf */}
          <section
            className="
              rounded-[24px]
              border border-[#24594f]/10
              bg-[#24594f]/[0.92]
              p-6
              text-white
              shadow-[0_16px_40px_rgba(36,89,79,0.10)]
            "
          >
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

          {/* Data */}
          <section
            className="
              rounded-[24px]
              border border-white/75
              bg-white/50
              p-6
              shadow-[0_12px_35px_rgba(24,53,51,0.05)]
              backdrop-blur-2xl
            "
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#71817d]">
              Your data
            </p>

            <h2 className="mt-2 text-lg font-medium tracking-[-0.02em] text-[#183533]">
              Data management
            </h2>

            <div className="mt-5 space-y-2.5">
              <button
                type="button"
                className="
                  w-full rounded-[11px]
                  border border-[#dce7e3]
                  bg-white/55
                  px-4 py-2.5
                  text-left text-sm font-medium
                  text-[#24594f]
                  transition
                  hover:bg-white/80
                "
              >
                Export my data
              </button>

              <button
                type="button"
                className="
                  w-full rounded-[11px]
                  border border-[#e8d8d3]
                  bg-[#fff9f7]/60
                  px-4 py-2.5
                  text-left text-sm font-medium
                  text-[#a05243]
                  transition
                  hover:bg-[#fff9f7]
                "
              >
                Clear all data
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Settings