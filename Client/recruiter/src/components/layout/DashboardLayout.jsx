import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import Header from "./Header"

const DashboardLayout = () => {
  return (
    <div
      style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif" }}
      className="flex h-screen bg-gray-50 overflow-hidden"
    >
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout