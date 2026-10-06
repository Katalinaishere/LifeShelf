import { NavLink } from 'react-router-dom'

const navigation = [
  {
    to: '/',
    label: 'Dashboard',
    end: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-[19px] w-[19px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
      >
        <path d="M4 10.5 12 4l8 6.5" />
        <path d="M6.5 9.5V20h11V9.5" />
        <path d="M9.5 20v-5.5h5V20" />
      </svg>
    ),
  },
  {
    to: '/products',
    label: 'Products',
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-[19px] w-[19px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
      >
        <path d="M5 7.5h14v12H5z" />
        <path d="M8 7.5V5h8v2.5" />
        <path d="M9 11h6" />
        <path d="M9 15h4" />
      </svg>
    ),
  },
  {
    to: '/usage',
    label: 'Usage',
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-[19px] w-[19px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
      >
        <path d="M7 4h10v16H7z" />
        <path d="M9.5 8h5" />
        <path d="M9.5 12h5" />
        <path d="M9.5 16h3" />
      </svg>
    ),
  },
  {
    to: '/analytics',
    label: 'Analytics',
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-[19px] w-[19px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
      >
        <path d="M5 19V10" />
        <path d="M10 19V6" />
        <path d="M15 19v-8" />
        <path d="M20 19V4" />
        <path d="M4 19h17" />
      </svg>
    ),
  },
  {
    to: '/expiring',
    label: 'Expiring',
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-[19px] w-[19px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="8" />
        <path d="M12 7.5v5l3 2" />
      </svg>
    ),
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-[19px] w-[19px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19 12a7 7 0 0 0-.1-1.1l2-1.5-2-3.4-2.3.9a7.4 7.4 0 0 0-1.9-1.1L14.4 3h-4l-.3 2.8a7.4 7.4 0 0 0-1.9 1.1l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5.8 12c0 .4 0 .8.1 1.1l-2 1.5 2 3.4 2.3-.9a7.4 7.4 0 0 0 1.9 1.1l.3 2.8h4l.3-2.8a7.4 7.4 0 0 0 1.9-1.1l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.1Z" />
      </svg>
    ),
  },
]

function Sidebar() {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="
          fixed left-5 top-1/2 z-40 hidden
          h-[calc(100vh-40px)] max-h-[720px] w-[64px]
          -translate-y-1/2
          flex-col items-center justify-between
          rounded-[26px]
          border border-white/75
          bg-white/45
          shadow-[0_18px_55px_rgba(24,53,51,0.07)]
          backdrop-blur-2xl
          md:flex
          lg:left-6
        "
      >
        <nav className="flex w-full flex-col items-center gap-1.5 pt-5">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              aria-label={item.label}
              className={({ isActive }) =>
                `group relative flex h-11 w-11 items-center justify-center rounded-[15px] transition-all duration-200 ${
                  isActive
                    ? 'border border-[#24594f]/10 bg-[#dce9e4]/75 text-[#24594f] shadow-[0_4px_14px_rgba(36,89,79,0.06)]'
                    : 'text-[#71817d] hover:bg-white/65 hover:text-[#24594f]'
                }`
              }
            >
              {item.icon}

              <span
                className="
                  pointer-events-none absolute left-[58px] top-1/2 z-50
                  -translate-y-1/2 whitespace-nowrap
                  rounded-lg
                  border border-white/70
                  bg-[#f6efe0]/95
                  px-3 py-1.5
                  text-[11px] font-medium tracking-wide
                  text-[#183533]
                  opacity-0
                  shadow-[0_8px_25px_rgba(24,53,51,0.10)]
                  transition-opacity duration-150
                  group-hover:opacity-100
                "
              >
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Add Product */}
        <div className="pb-5">
          <NavLink
            to="/add-product"
            aria-label="Add product"
            className="
              group relative flex h-11 w-11 items-center justify-center
              rounded-[15px]
              border border-[#24594f]/15
              bg-[#24594f]/90
              text-white
              shadow-[0_8px_22px_rgba(36,89,79,0.12)]
              transition-all duration-200
              hover:-translate-y-0.5
              hover:bg-[#24594f]
            "
          >
            <svg
              viewBox="0 0 24 24"
              className="h-[19px] w-[19px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>

            <span
              className="
                pointer-events-none absolute left-[58px] top-1/2 z-50
                -translate-y-1/2 whitespace-nowrap
                rounded-lg
                border border-white/70
                bg-[#f6efe0]/95
                px-3 py-1.5
                text-[11px] font-medium tracking-wide
                text-[#183533]
                opacity-0
                shadow-[0_8px_25px_rgba(24,53,51,0.10)]
                transition-opacity duration-150
                group-hover:opacity-100
              "
            >
              Add product
            </span>
          </NavLink>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav
        className="
          fixed bottom-4 left-4 right-4 z-40
          flex items-center justify-around
          rounded-[24px]
          border border-white/75
          bg-white/65
          px-2 py-2
          shadow-[0_15px_45px_rgba(24,53,51,0.09)]
          backdrop-blur-2xl
          md:hidden
        "
      >
        {navigation.slice(0, 5).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            aria-label={item.label}
            className={({ isActive }) =>
              `flex h-11 w-11 items-center justify-center rounded-[15px] transition-all duration-200 ${
                isActive
                  ? 'border border-[#24594f]/10 bg-[#dce9e4]/80 text-[#24594f]'
                  : 'text-[#71817d] hover:bg-white/65 hover:text-[#24594f]'
              }`
            }
          >
            {item.icon}
          </NavLink>
        ))}

        <NavLink
          to="/add-product"
          aria-label="Add product"
          className="
            flex h-11 w-11 items-center justify-center
            rounded-[15px]
            bg-[#24594f]/90
            text-white
            shadow-[0_8px_20px_rgba(36,89,79,0.12)]
          "
        >
          <svg
            viewBox="0 0 24 24"
            className="h-[19px] w-[19px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
        </NavLink>
      </nav>
    </>
  )
}

export default Sidebar