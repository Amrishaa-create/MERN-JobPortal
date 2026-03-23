import { NavLink } from "react-router-dom"
import {
  LayoutDashboard, Users, Briefcase, FileText,
  Shield, ChevronRight, X
} from "lucide-react"

const menu = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    color: "text-blue-400",
    activeBg: "bg-blue-500",
    glow: "shadow-blue-500/20"
  },
  {
    name: "Manage Users",
    path: "/users",
    icon: Users,
    color: "text-violet-400",
    activeBg: "bg-violet-500",
    glow: "shadow-violet-500/20"
  },
  {
    name: "Manage Jobs",
    path: "/jobs",
    icon: Briefcase,
    color: "text-emerald-400",
    activeBg: "bg-emerald-500",
    glow: "shadow-emerald-500/20"
  },
  {
    name: "Applications",
    path: "/applications",
    icon: FileText,
    color: "text-orange-400",
    activeBg: "bg-orange-500",
    glow: "shadow-orange-500/20"
  }
]

function Sidebar({ collapsed, mobileOpen, setMobileOpen }) {
  return (
    <aside
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
      className={`
        fixed lg:static top-0 left-0 z-50
        h-screen bg-[#1a1d27] border-r border-white/5
        flex flex-col flex-shrink-0
        transition-all duration-300 ease-in-out
        ${mobileOpen ? "translate-x-0 w-80" : "-translate-x-full w-72"}
        ${collapsed ? "lg:w-20 lg:translate-x-0" : "lg:w-75 lg:translate-x-0"}
      `}
    >
      <div className={`
        h-24 flex items-center border-b border-white/5 flex-shrink-0
        transition-all duration-300
        ${collapsed ? "justify-center px-4" : "px-6 gap-3"}
      `}>
        <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center flex-shrink-0">
          <Shield size={24} className="text-white" />
        </div>

        {!collapsed && (
          <div className="flex-1 overflow-hidden">
            <h1 className="text-3xl font-black text-white leading-none">HireHub</h1>
            <p className="text-xl font-black text-gray-500 uppercase tracking-[0.2em] mt-0.5">
              Admin Panel
            </p>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        )}
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="text-2xl font-black text-gray-600 uppercase tracking-[0.2em] px-3 mb-4">
            Navigation
          </p>
        )}
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center rounded-2xl transition-all duration-200 group relative
              ${collapsed ? "justify-center w-12 h-12 mx-auto" : "gap-4 px-4 py-5"}
              ${isActive
                ? `${item.activeBg} text-white shadow-lg ${item.glow}`
                : "text-gray-500 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`
                  flex items-center justify-center flex-shrink-0 rounded-xl transition-all
                  ${collapsed ? "w-10 h-10" : "w-10 h-10"}
                  ${isActive
                    ? "bg-white/20"
                    : "bg-white/5 group-hover:bg-white/10"
                  }
                `}>
                  <item.icon
                    size={24}
                    className={isActive ? "text-white" : item.color}
                  />
                </div>
                {!collapsed && (
                  <>
                    <span className="flex-1 text-2xl font-black">
                      {item.name}
                    </span>
                    {isActive && (
                      <ChevronRight size={24} className="text-white/60 flex-shrink-0" />
                    )}
                  </>
                )}
                {collapsed && (
                  <div className="
                    absolute left-full ml-3 px-3 py-2
                    bg-[#1a1d27] border border-white/10
                    text-white text-xl font-bold rounded-xl shadow-2xl
                    opacity-0 group-hover:opacity-100
                    pointer-events-none transition-opacity
                    whitespace-nowrap z-50
                  ">
                    {item.name}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="flex-shrink-0 px-4 pb-6">
        {!collapsed ? (
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xl font-black text-green-400 uppercase tracking-widest">
                System Online
              </span>
            </div>
            <p className="text-xl text-gray-500 font-medium leading-relaxed">
              All services running normally.
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar