import { Search, LogOut, Bell, ChevronDown } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"

const pageTitles = {
  "/":             { title: "Dashboard",    sub: "Overview of your hiring pipeline" },
  "/jobs":         { title: "My Jobs",      sub: "Manage your job postings" },
  "/candidates":   { title: "Candidates",   sub: "Browse candidate profiles" },
  "/applications": { title: "Applications", sub: "Review incoming applications" },
  "/interviews":   { title: "Interviews",   sub: "Manage scheduled interviews" },
}

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showDropdown, setShowDropdown] = useState(false)
  const page = pageTitles[location.pathname] || { title: "HireHub", sub: "Recruiter Portal" }
  const handleLogout = async () => {
    try {
      await logout()
      navigate("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <header
      style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif" }}
      className="w-full bg-white border-b border-gray-100 px-6 md:px-8 py-4 flex items-center justify-between gap-4"
    >
      <div className="hidden lg:block">
        <h2 className="text-4xl font-black text-gray-900 leading-none">{page.title}</h2>
        <p className="text-2xl text-gray-400 font-medium mt-0.5">{page.sub}</p>
      </div>
      <div className="w-14 lg:hidden flex-shrink-0" />
      <div className="relative flex-1 max-w-md mx-auto">
        <Search size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          placeholder="Search jobs, candidates..."
          className="w-full bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-400 pl-11 pr-5 py-3 rounded-2xl text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
        />
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <button className="w-11 h-11 rounded-2xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition relative">
          <Bell size={24} />
        </button>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-2xl transition"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-2xl font-black flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || "R"}
            </div>
            <span className="text-xl font-black text-gray-800 hidden sm:block max-w-[120px] truncate">
              {user?.name || "Recruiter"}
            </span>
            <ChevronDown size={24} className={`text-gray-500 transition-transform hidden sm:block ${showDropdown ? "rotate-180" : ""}`} />
          </button>
          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 top-14 z-20 bg-white border border-gray-100 rounded-2xl shadow-xl w-56 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <p className="text-2xl font-black text-gray-900 truncate">{user?.name || "Recruiter"}</p>
                  <p className="text-xl text-gray-400 truncate">{user?.email || ""}</p>
                </div>
                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition font-bold text-2xl text-left"
                  >
                    <LogOut size={24} />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header