import type { ReactNode } from 'react'
import Sidebar from '../components/Sidebar'

interface DashboardLayoutProps {
  children: ReactNode
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen overflow-x-hidden text-[#183533]">
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none fixed inset-0 -z-10
          overflow-hidden
        "
      >
        <div
          className="
            absolute -left-32 -top-32
            h-[420px] w-[420px]
            rounded-full
            bg-[#dce9e4]/70
            blur-3xl
          "
        />

        <div
          className="
            absolute -right-32 top-[18%]
            h-[360px] w-[360px]
            rounded-full
            bg-[#e6a92d]/[0.06]
            blur-3xl
          "
        />

        <div
          className="
            absolute bottom-[-180px] left-[35%]
            h-[420px] w-[420px]
            rounded-full
            bg-[#24594f]/[0.07]
            blur-3xl
          "
        />
      </div>

      {/* Navigation */}
      <Sidebar />

      {/* Main application area */}
      <main
        className="
          min-h-screen
          px-8 py-8
          pl-[104px]

          max-[767px]:px-4
          max-[767px]:pb-28
          max-[767px]:pt-5
        "
      >
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout