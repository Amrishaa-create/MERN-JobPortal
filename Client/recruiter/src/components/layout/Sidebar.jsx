import { useState } from "react"
import { NavLink } from "react-router-dom"
import { LayoutDashboard, Users, Briefcase, Calendar, FileText, X, Menu, ChevronRight } from "lucide-react"
import { useAuth } from "../../context/AuthContext"

const menu = [
  { name: "Dashboard",    icon: LayoutDashboard,  path: "/",             color: "text-blue-500",   activeBg: "bg-blue-500" },
  { name: "Jobs",         icon: Briefcase,        path: "/jobs",         color: "text-violet-500", activeBg: "bg-violet-500" },
  { name: "Candidates",   icon: Users,            path: "/candidates",   color: "text-emerald-500",activeBg: "bg-emerald-500" },
  { name: "Applications", icon: FileText,         path: "/applications", color: "text-orange-500", activeBg: "bg-orange-500" },
  { name: "Interviews",   icon: Calendar,         path: "/interviews",   color: "text-pink-500",   activeBg: "bg-pink-500" },
]
const Sidebar = () => {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  return (
    <>
      <button
        className="lg:hidden fixed top-5 left-4 z-50 w-11 h-11 bg-white border border-gray-200 rounded-2xl shadow-lg flex items-center justify-center hover:bg-gray-50 transition"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={20} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
      </button>
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif" }}
        className={`
          fixed lg:static top-0 left-0 h-full z-40
          w-72 bg-white border-r border-gray-100
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="px-7 py-7 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-500 flex items-center justify-center flex-shrink-0">
              <Briefcase size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 leading-none">HireHub</h1>
              <p className="text-2xl font-bold text-gray-400 uppercase tracking-widest mt-0.5">Recruiter</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="text-xl font-black text-gray-400 uppercase tracking-[0.2em] px-3 mb-4">
            Navigation
          </p>
          {menu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-5 rounded-2xl text-3xl font-bold transition-all duration-200 group relative ${
                  isActive
                    ? `${item.activeBg} text-white shadow-lg`
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                    isActive ? "bg-white/20" : "bg-gray-100 group-hover:bg-white"
                  }`}>
                    <item.icon size={26} className={isActive ? "text-white" : item.color} />
                  </div>
                  <span className="flex-1">{item.name}</span>
                  {isActive && (
                    <ChevronRight size={24} className="text-white/70" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 pb-6">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-lg font-black flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || "R"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-2xl font-black text-gray-900 truncate">{user?.name || "Recruiter"}</p>
              <p className="text-xl text-gray-400 font-medium truncate">{user?.email || ""}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar