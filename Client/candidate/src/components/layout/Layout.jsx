import { useState } from "react"
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)

  const toggleSidebar = () => setCollapsed(!collapsed)

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', 'Nunito', sans-serif" }}
      className="flex h-screen bg-slate-50 overflow-hidden"
    >
      <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />

      <div
        className={`
          flex flex-col flex-1 min-w-0 h-screen overflow-hidden
          transition-all duration-300
          ${collapsed ? "ml-20" : "ml-72"}
        `}
      >
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout