import { Menu, LogOut, Bell, ChevronDown, Shield } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import API from "../services/api"

const pageMeta = {
  "/dashboard": { title: "Dashboard",    sub: "Platform overview & stats" },
  "/users":     { title: "Manage Users", sub: "View and remove platform users" },
  "/jobs":      { title: "Manage Jobs",  sub: "Approve, reject and delete job postings" },
  "/applications": { title: "Applications", sub: "All candidate applications" }
}
function Navbar({ toggleSidebar, openMobile }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDropdown, setShowDropdown] = useState(false)

  const page = Object.entries(pageMeta).find(([path]) =>
    location.pathname.includes(path)
  )?.[1] || { title: "Admin Panel", sub: "HireHub control center" }
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await API.get("/auth/me/admin")
        setAdmin(res.data)
      } catch (err) {
        console.log("Fetch admin error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchAdmin()
  }, [])
  const handleLogout = async () => {
    try {
      await API.post("/auth/logout")
      navigate("/")
    } catch (err) {
      console.log("Logout error:", err)
    }
  }

  return (
    <header
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
      className="h-20 bg-[#0f1117] border-b border-white/5 flex items-center justify-between px-4 md:px-8 flex-shrink-0"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={openMobile}
          className="lg:hidden w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition"
        >
          <Menu size={24} />
        </button>
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 items-center justify-center text-gray-400 hover:text-white transition"
        >
          <Menu size={24} />
        </button>
        <div className="hidden sm:block">
          <h1 className="text-2xl md:text-3xl font-black text-white leading-none">
            {page.title}
          </h1>
          <p className="text-xl text-gray-500 font-medium mt-0.5">{page.sub}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="w-11 h-11 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition">
          <Bell size={24} />
        </button>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-2xl transition border border-white/10"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center text-white text-2xl font-black flex-shrink-0">
              {admin?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-2xl font-black text-white leading-none">
                {loading ? "Loading..." : (admin?.name || "Admin")}
              </p>
              <p className="text-xl text-gray-500 mt-0.5">Administrator</p>
            </div>
            <ChevronDown size={22} className={`text-gray-500 transition-transform hidden sm:block ${showDropdown ? "rotate-180" : ""}`} />
          </button>
          {showDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
              <div className="absolute right-0 top-14 z-20 bg-[#1a1d27] border border-white/10 rounded-2xl shadow-2xl w-56 overflow-hidden">
                <div className="px-5 py-4 border-b border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield size={24} className="text-blue-400" />
                    <span className="text-xl font-black text-blue-400 uppercase tracking-widest">Admin</span>
                  </div>
                  <p className="text-2xl font-black text-white truncate">{admin?.name || "Admin"}</p>
                  <p className="text-xl text-gray-500 truncate">{admin?.email || ""}</p>
                </div>
                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition font-bold text-2xl text-left"
                  >
                    <LogOut size={26} />
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

export default Navbar