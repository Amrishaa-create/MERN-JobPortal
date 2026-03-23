import {LayoutDashboard, Briefcase, FileText,Bookmark, Calendar, User, Settings,ChevronLeft, ChevronRight, Sparkles} from "lucide-react"
import { NavLink } from "react-router-dom"

const menu = [
  { name: "Dashboard",    icon: LayoutDashboard, path: "/",             accent: "#6366f1", activeBg: "bg-indigo-500" },
  { name: "Browse Jobs",  icon: Briefcase,       path: "/jobs",         accent: "#0ea5e9", activeBg: "bg-sky-500" },
  { name: "Applications", icon: FileText,        path: "/applications", accent: "#10b981", activeBg: "bg-emerald-500" },
  { name: "Saved Jobs",   icon: Bookmark,        path: "/saved-jobs",   accent: "#f59e0b", activeBg: "bg-amber-500" },
  { name: "Interviews",   icon: Calendar,        path: "/interviews",   accent: "#ec4899", activeBg: "bg-pink-500" },
  { name: "Profile",      icon: User,            path: "/profile",      accent: "#8b5cf6", activeBg: "bg-violet-500" },
  { name: "Settings",     icon: Settings,        path: "/settings",     accent: "#64748b", activeBg: "bg-slate-500" }
]
function Sidebar({ collapsed, toggleSidebar }) {
  return (
  <div
  className={`fixed top-0 left-0 h-full z-40 flex flex-col transition-all duration-300 ease-in-out ${collapsed ? "w-21" : "w-77"}`}
  style={{
    fontFamily: "'Plus Jakarta Sans', 'Nunito', sans-serif",
    background: "linear-gradient(160deg, #eef2ff 0%, #ede9fe 50%, #fce7f3 100%)"
  }}
>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500" />
      <div className="absolute top-0 right-0 bottom-0 w-px bg-indigo-100" />
      <div className={`
        flex items-center h-20 border-b border-indigo-100 flex-shrink-0
        ${collapsed ? "justify-center px-0" : "px-6 justify-between"}
      `}>
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-200">
              <Sparkles size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-indigo-900 leading-none">HireHub</h2>
              <p className="text-lg text-indigo-400 font-black mt-0.5 uppercase tracking-[0.15em]">
                Candidate Portal
              </p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <Sparkles size={24} className="text-white" />
          </div>
        )}
        {!collapsed && (
          <button
            onClick={toggleSidebar}
            className="w-9 h-9 rounded-xl bg-indigo-100 hover:bg-indigo-200 flex items-center justify-center text-indigo-400 hover:text-indigo-700 transition"
          >
            <ChevronLeft size={24} />
          </button>
        )}
      </div>
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="text-2xl font-black text-indigo-300 uppercase tracking-[0.25em] px-3 mb-4">
            Navigation
          </p>
        )}
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex items-center rounded-2xl transition-all duration-200 group relative
              ${collapsed ? "justify-center w-12 h-12 mx-auto" : "gap-3 px-3 py-3.5"}
              ${isActive
                ? `${item.activeBg} text-white shadow-lg`
                : "text-indigo-700 hover:bg-white/60 hover:text-indigo-900"
              }`
            }
            style={({ isActive }) => isActive ? { boxShadow: `0 4px 14px ${item.accent}40` } : {}}
          >
            {({ isActive }) => (
              <>
               
                <div className={`
                  w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all
                  ${isActive
                    ? "bg-white/20"
                    : "bg-white/40 group-hover:bg-white/70"
                  }
                `}>
                  <item.icon
                    size={24}
                    className={isActive ? "text-white" : ""}
                    style={!isActive ? { color: item.accent } : {}}
                  />
                </div>

                {!collapsed && (
                  <span className={`text-3xl font-black flex-1 ${
                    isActive ? "text-white" : "text-indigo-800 group-hover:text-indigo-900"
                  }`}>
                    {item.name}
                  </span>
                )}
                {!collapsed && isActive && (
                  <ChevronRight size={16} className="text-white/70 flex-shrink-0" />
                )}
                {collapsed && (
                  <div className="
                    absolute left-full ml-3 px-4 py-2.5
                    bg-indigo-900 border border-indigo-700
                    text-white text-xl font-black rounded-xl shadow-xl
                    opacity-0 group-hover:opacity-100
                    pointer-events-none transition-opacity whitespace-nowrap z-50
                  ">
                    {item.name}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="flex-shrink-0 px-3 pb-6">
        {collapsed ? (
          <button
            onClick={toggleSidebar}
            className="w-12 h-12 mx-auto rounded-2xl bg-indigo-100 hover:bg-indigo-200 flex items-center justify-center text-indigo-400 hover:text-indigo-700 transition"
          >
            <ChevronRight size={24} />
          </button>
        ) : (
          <>
            <button
              onClick={toggleSidebar}
              className="w-full flex items-center justify-center gap-2 bg-white/50 hover:bg-white/80 border border-indigo-100 text-indigo-600 font-black text-2xl py-3 rounded-2xl transition mb-3"
            >
              <ChevronLeft size={24} /> Collapse
            </button>
            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-4 text-white">
              <p className="text-2xl font-black mb-1">Pro Tip</p>
              <p className="text-xl text-indigo-100 leading-relaxed">
                Update your skills to get better job recommendations!
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Sidebar