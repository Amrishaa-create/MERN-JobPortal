import { useState } from "react"
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"

function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
      className="flex h-screen bg-[#0f1117] text-white overflow-hidden"
    >
      <div
        className={`
          flex-shrink-0 h-screen
          transition-all duration-300 ease-in-out
          ${collapsed ? "lg:w-20" : "lg:w-72"}
          ${mobileOpen ? "w-72" : "w-0"}
          lg:relative fixed z-40
        `}
      >
        <Sidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
      </div>
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
        />
      )}
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
        <Navbar
          toggleSidebar={() => setCollapsed(!collapsed)}
          openMobile={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-y-auto bg-[#0f1117]">
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout